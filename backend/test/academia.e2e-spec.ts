import {
  describe,
  it,
  before as beforeAll,
  after as afterAll,
} from 'node:test';
import { expect } from 'expect';
import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Connection, Types } from 'mongoose';
import { Server } from 'http';
import request from 'supertest';
import { randomBytes } from 'crypto';
import { AppModule } from '../src/app.module';
import { configurarAplicacao } from '../src/configurar-aplicacao';
import { UsuariosService } from '../src/usuarios/usuarios.service';

type Registro = { _id: string; [campo: string]: unknown };
type Resposta = {
  sucesso: boolean;
  dados: Registro;
  message?: string | string[];
};
void describe('Academia — API integrada ao MongoDB', () => {
  let app: INestApplication;
  let banco: Connection;
  let servidor: Server;
  const tokens: Record<string, string> = {};
  const ids: Record<string, string> = {};
  const nomeBanco = `academia_teste_${process.pid}_${Date.now()}`;
  let sequencia = 0;
  const novoAluno = () => ({
    nome: 'Aluno de teste',
    email: `aluno${++sequencia}@teste.com`,
    telefone: '(51) 99999-9999',
    dataNascimento: '2000-05-10',
    objetivo: 'saude',
  });
  const dados = (res: request.Response) => (res.body as Resposta).dados;
  const post = (rota: string, dto: object, perfil = 'admin') =>
    request(servidor)
      .post(`/api/v1/${rota}`)
      .auth(tokens[perfil], { type: 'bearer' })
      .send(dto);
  const get = (rota: string, perfil = 'admin') =>
    request(servidor)
      .get(`/api/v1/${rota}`)
      .auth(tokens[perfil], { type: 'bearer' });
  const patch = (rota: string, dto: object, perfil = 'admin') =>
    request(servidor)
      .patch(`/api/v1/${rota}`)
      .auth(tokens[perfil], { type: 'bearer' })
      .send(dto);
  const del = (rota: string, perfil = 'admin') =>
    request(servidor)
      .delete(`/api/v1/${rota}`)
      .auth(tokens[perfil], { type: 'bearer' });
  const matricula = (aluno = ids.alunos) => ({
    aluno,
    plano: ids.planos,
    instrutor: ids.instrutores,
    dataInicio: '2099-12-01',
  });

  beforeAll(async () => {
    // This suite creates and removes ONLY its own uniquely named database.
    process.env.MONGODB_URI = `mongodb://127.0.0.1:27017/${nomeBanco}`;
    process.env.JWT_SECRET = randomBytes(32).toString('hex');
    Logger.overrideLogger(false);
    const modulo = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modulo.createNestApplication();
    configurarAplicacao(app);
    await app.init();
    banco = app.get<Connection>(getConnectionToken());
    await Promise.all(
      banco.modelNames().map((nome) => banco.model(nome).init()),
    );
    servidor = app.getHttpServer() as Server;
    const usuarios = app.get(UsuariosService);
    for (const perfil of ['admin', 'atendente', 'consulta'] as const) {
      await usuarios.criar({
        nome: `Usuário ${perfil}`,
        email: `${perfil}@teste.com`,
        senha: 'Senha@123',
        perfil,
      });
      const login = await request(servidor)
        .post('/api/v1/auth/login')
        .send({ email: `${perfil}@teste.com`, senha: 'Senha@123' })
        .expect(200);
      tokens[perfil] = (
        login.body as { dados: { accessToken: string } }
      ).dados.accessToken;
      expect(JSON.stringify(login.body)).not.toContain('senhaHash');
    }
    ids.modalidades = dados(
      await post('modalidades', {
        nome: 'Musculação',
        intensidade: 'moderada',
        capacidadeMaxima: 20,
      }).expect(201),
    )._id;
    ids.instrutores = dados(
      await post('instrutores', {
        nome: 'Instrutor teste',
        email: 'instrutor@teste.com',
        telefone: '(51) 99999-9999',
        cref: '123456-G/RS',
        turno: 'noite',
      }).expect(201),
    )._id;
    ids.alunos = dados(await post('alunos', novoAluno()).expect(201))._id;
    ids.planos = dados(
      await post('planos', {
        nome: 'Musculação mensal',
        modalidade: ids.modalidades,
        valorMensal: 100,
        duracaoMeses: 1,
      }).expect(201),
    )._id;
  });
  afterAll(async () => {
    if (
      banco &&
      banco.name === nomeBanco &&
      banco.name.startsWith('academia_teste_')
    )
      await banco.dropDatabase();
    if (app) await app.close();
  });
  void it('rejeita acesso sem token nos seis módulos com erro padronizado', async () => {
    for (const rota of [
      'alunos',
      'planos',
      'instrutores',
      'modalidades',
      'matriculas',
      'relatorios/resumo',
    ]) {
      const res = await request(servidor).get(`/api/v1/${rota}`).expect(401);
      expect(res.body).toMatchObject({
        sucesso: false,
        status: 401,
        caminho: `/api/v1/${rota}`,
        dataHora: expect.any(String),
      });
    }
  });
  void it('rejeita token malformado, forjado e expirado', async () => {
    await request(servidor)
      .get('/api/v1/alunos')
      .set('Authorization', 'Bearer abc')
      .expect(401);
    await request(servidor)
      .get('/api/v1/alunos')
      .set('Authorization', 'Basic abc')
      .expect(401);
    const usuario = dados(await get('auth/me'));
    const expirado = await app
      .get(JwtService)
      .signAsync(
        { sub: usuario._id, nome: 'Admin', perfil: 'admin' },
        { expiresIn: -1 },
      );
    await request(servidor)
      .get('/api/v1/alunos')
      .auth(expirado, { type: 'bearer' })
      .expect(401);
  });
  void it('cadastro público cria somente consulta e impede elevação de perfil', async () => {
    const dto = {
      nome: 'Conta pública',
      email: 'publico@teste.com',
      senha: 'Senha@123',
    };
    await request(servidor)
      .post('/api/v1/auth/cadastro')
      .send({ ...dto, perfil: 'admin' })
      .expect(400);
    const res = await request(servidor)
      .post('/api/v1/auth/cadastro')
      .send(dto)
      .expect(201);
    expect(dados(res).perfil).toBe('consulta');
    expect(dados(res)).not.toHaveProperty('senhaHash');
    await request(servidor)
      .post('/api/v1/auth/login')
      .send({ email: dto.email, senha: 'errada' })
      .expect(401);
  });
  void it('atendente pode cadastrar e editar, mas não excluir nem ver relatórios', async () => {
    const criado = dados(
      await post('alunos', novoAluno(), 'atendente').expect(201),
    );
    await patch(
      `alunos/${criado._id}`,
      { nome: 'Nome atualizado' },
      'atendente',
    ).expect(200);
    for (const rota of ['alunos', 'planos', 'instrutores', 'modalidades'])
      await del(`${rota}/${ids[rota]}`, 'atendente').expect(403);
    await get('relatorios/resumo', 'atendente').expect(403);
    await post(
      'usuarios',
      {
        nome: 'Tentativa',
        email: 'elevado@teste.com',
        senha: 'Senha@123',
        perfil: 'admin',
      },
      'atendente',
    ).expect(403);
  });
  void it('consulta acessa listas e detalhes e não modifica dados', async () => {
    for (const rota of ['alunos', 'planos', 'instrutores', 'modalidades']) {
      await get(rota, 'consulta').expect(200);
      await get(`${rota}/${ids[rota]}`, 'consulta').expect(200);
      await post(rota, {}, 'consulta').expect(403);
      await patch(`${rota}/${ids[rota]}`, {}, 'consulta').expect(403);
      await del(`${rota}/${ids[rota]}`, 'consulta').expect(403);
    }
    await post('matriculas', matricula(), 'consulta').expect(403);
  });
  void it('valida IDs, campos extras, null, datas impossíveis e capacidade fracionária', async () => {
    await get('alunos/abc').expect(400);
    await get(`alunos/${new Types.ObjectId().toString()}`).expect(404);
    await post('alunos', { ...novoAluno(), administrador: true }).expect(400);
    await patch(`alunos/${ids.alunos}`, { nome: null }).expect(400);
    await patch(`alunos/${ids.alunos}`, { ativo: null }).expect(400);
    await post('alunos', {
      ...novoAluno(),
      dataNascimento: '2000-02-30',
    }).expect(400);
    await post('modalidades', {
      nome: 'Inválida',
      intensidade: 'leve',
      capacidadeMaxima: 1.5,
    }).expect(400);
    await get('planos?duracaoMeses=7').expect(400);
  });
  void it('aplica idade mínima também em atualização', async () => {
    const data = new Date().toISOString().slice(0, 10);
    await post('alunos', { ...novoAluno(), dataNascimento: data }).expect(400);
    await patch(`alunos/${ids.alunos}`, { dataNascimento: data }).expect(400);
  });
  void it('não permite email ou CREF duplicados nem nome com caixa diferente', async () => {
    const aluno = dados(await get(`alunos/${ids.alunos}`));
    await post('alunos', {
      ...novoAluno(),
      email: String(aluno.email).toUpperCase(),
    }).expect(409);
    await post('modalidades', {
      nome: 'MUSCULAÇÃO',
      intensidade: 'leve',
      capacidadeMaxima: 10,
    }).expect(409);
    await post('instrutores', {
      nome: 'Outro instrutor',
      email: 'outro@teste.com',
      telefone: '(51) 99999-8888',
      cref: '123456-G/RS',
      turno: 'manha',
    }).expect(409);
  });
  void it('valida referência de plano inexistente e modalidade inativa', async () => {
    await post('planos', {
      nome: 'Referência inválida',
      modalidade: new Types.ObjectId().toString(),
      valorMensal: 100,
      duracaoMeses: 1,
    }).expect(404);
    const modalidade = dados(
      await post('modalidades', {
        nome: 'Modalidade inativa',
        intensidade: 'leve',
        capacidadeMaxima: 10,
      }).expect(201),
    );
    await del(`modalidades/${modalidade._id}`).expect(204);
    await post('planos', {
      nome: 'Plano inválido',
      modalidade: modalidade._id,
      valorMensal: 100,
      duracaoMeses: 1,
    }).expect(400);
  });
  void it('persiste criação, edição, filtro e inativação dos quatro cadastros', async () => {
    const casos: [string, object, string][] = [
      ['alunos', novoAluno(), 'objetivo=saude'],
      [
        'instrutores',
        {
          nome: 'Instrutor CRUD',
          email: 'crud@teste.com',
          telefone: '(51) 99999-8888',
          cref: '654321-G/RS',
          turno: 'tarde',
        },
        'turno=tarde',
      ],
      [
        'modalidades',
        {
          nome: 'Modalidade CRUD',
          intensidade: 'intensa',
          capacidadeMaxima: 30,
        },
        'intensidade=intensa',
      ],
      [
        'planos',
        {
          nome: 'Plano CRUD',
          modalidade: ids.modalidades,
          valorMensal: 199.9,
          duracaoMeses: 6,
        },
        'duracaoMeses=6',
      ],
    ];
    for (const [rota, dto, filtro] of casos) {
      const criado = dados(await post(rota, dto).expect(201));
      await patch(`${rota}/${criado._id}`, { nome: 'Registro editado' }).expect(
        200,
      );
      expect(dados(await get(`${rota}/${criado._id}`).expect(200)).nome).toBe(
        'Registro editado',
      );
      expect((await get(`${rota}?${filtro}`).expect(200)).body).toMatchObject({
        dados: expect.arrayContaining([
          expect.objectContaining({ _id: criado._id }),
        ]),
      });
      const apagado = await del(`${rota}/${criado._id}`).expect(204);
      expect(apagado.text).toBe('');
      expect((await get(rota)).body).not.toMatchObject({
        dados: expect.arrayContaining([
          expect.objectContaining({ _id: criado._id }),
        ]),
      });
      expect((await get(`${rota}?todos=true`)).body).toMatchObject({
        dados: expect.arrayContaining([
          expect.objectContaining({ _id: criado._id, ativo: false }),
        ]),
      });
      expect(
        await banco
          .collection(rota)
          .findOne({ _id: new Types.ObjectId(criado._id) }),
      ).toMatchObject({ ativo: false });
    }
  });
  void it('matrícula: cria, edita, tranca, reativa e cancela; preserva histórico', async () => {
    const criada = dados(await post('matriculas', matricula()).expect(201));
    await post('matriculas', matricula()).expect(409);
    await patch(`matriculas/${criada._id}`, {
      dataInicio: '2099-12-02',
    }).expect(200);
    await patch(`matriculas/${criada._id}`, { status: 'cancelada' }).expect(
      400,
    );
    for (const status of ['trancada', 'ativa', 'cancelada'])
      await patch(`matriculas/${criada._id}/status`, { status }).expect(200);
    await patch(`matriculas/${criada._id}/status`, { status: 'ativa' }).expect(
      400,
    );
    const registro = dados(await get(`matriculas/${criada._id}`));
    expect(registro.status).toBe('cancelada');
    expect(registro.aluno).toHaveProperty('nome');
  });
  void it('impede duas matrículas ativas mesmo em requisições simultâneas', async () => {
    const aluno = dados(await post('alunos', novoAluno()).expect(201));
    const respostas = await Promise.all([
      post('matriculas', matricula(aluno._id)),
      post('matriculas', matricula(aluno._id)),
    ]);
    expect(respostas.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(
      await banco.collection('matriculas').countDocuments({
        aluno: new Types.ObjectId(aluno._id),
        status: 'ativa',
      }),
    ).toBe(1);
  });
  void it('valida data passada e referências inativas na matrícula', async () => {
    const aluno = dados(await post('alunos', novoAluno()).expect(201));
    await post('matriculas', {
      ...matricula(aluno._id),
      dataInicio: '2000-01-01',
    }).expect(400);
    await del(`alunos/${aluno._id}`).expect(204);
    await post('matriculas', matricula(aluno._id)).expect(400);
  });
  void it('retorna relatórios consistentes com os documentos persistidos', async () => {
    const resumo = dados(await get('relatorios/resumo').expect(200));
    expect(resumo.alunos).toBe(
      await banco.collection('alunos').countDocuments({ ativo: true }),
    );
    expect(resumo.matriculasAtivas).toBe(
      await banco.collection('matriculas').countDocuments({ status: 'ativa' }),
    );
    const receita = await get('relatorios/receita-por-plano').expect(200);
    expect(receita.body).toMatchObject({
      dados: expect.arrayContaining([
        expect.objectContaining({
          plano: 'Musculação mensal',
          matriculas: 1,
          receitaMensal: 100,
        }),
      ]),
    });
    const objetivos = await get('relatorios/alunos-por-objetivo').expect(200);
    expect(objetivos.body).toMatchObject({
      dados: expect.arrayContaining([
        expect.objectContaining({ _id: 'saude' }),
      ]),
    });
  });
});
