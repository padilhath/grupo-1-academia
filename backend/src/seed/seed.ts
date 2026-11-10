import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AlunoSchema, OPCOES_OBJETIVO } from '../alunos/schemas/aluno.schema';
import {
  InstrutorSchema,
  OPCOES_TURNO,
} from '../instrutores/schemas/instrutor.schema';
import {
  ModalidadeSchema,
  OPCOES_INTENSIDADE,
} from '../modalidades/schemas/modalidade.schema';
import {
  PlanoSchema,
  OPCOES_DURACAO_MESES,
} from '../planos/schemas/plano.schema';
import { MatriculaSchema } from '../matriculas/schemas/matricula.schema';
import { UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { hoje } from '../academia/validacao';
export async function seed() {
  await mongoose.connect(
    process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/projeto-integrador',
    { serverSelectionTimeoutMS: 5000 },
  );
  try {
    const Aluno = mongoose.model('Aluno', AlunoSchema);
    const Instrutor = mongoose.model('Instrutor', InstrutorSchema);
    const Modalidade = mongoose.model('Modalidade', ModalidadeSchema);
    const Plano = mongoose.model('Plano', PlanoSchema);
    const Matricula = mongoose.model('Matricula', MatriculaSchema);
    const Usuario = mongoose.model('Usuario', UsuarioSchema);
    await Promise.all([
      Aluno.init(),
      Instrutor.init(),
      Modalidade.init(),
      Plano.init(),
      Matricula.init(),
      Usuario.init(),
    ]);
    const nomes = [
      'Maria Souza',
      'João Lima',
      'Ana Costa',
      'Pedro Santos',
      'Carla Ribeiro',
    ];
    const modalidades = [
      'Musculação',
      'Pilates',
      'Spinning',
      'Alongamento',
      'Funcional',
    ];
    for (let i = 0; i < 5; i++) {
      const aluno = await Aluno.findOneAndUpdate(
        { email: `aluno${i + 1}@academia.com` },
        {
          $setOnInsert: {
            nome: nomes[i],
            telefone: `(51) 99999-000${i}`,
            dataNascimento: new Date(`${1990 + i}-05-10`),
            objetivo: OPCOES_OBJETIVO[i % 4],
            ativo: true,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      );
      const instrutor = await Instrutor.findOneAndUpdate(
        { email: `instrutor${i + 1}@academia.com` },
        {
          $setOnInsert: {
            nome: `Instrutor ${nomes[i]}`,
            telefone: `(51) 98888-000${i}`,
            cref: `01234${i}-G/RS`,
            turno: OPCOES_TURNO[i % 3],
            ativo: true,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      );
      const modalidade = await Modalidade.findOneAndUpdate(
        { nome: modalidades[i] },
        {
          $setOnInsert: {
            descricao: `Aulas de ${modalidades[i]}`,
            intensidade: OPCOES_INTENSIDADE[i % 3],
            capacidadeMaxima: 10 + i * 5,
            ativo: true,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ).collation({ locale: 'pt', strength: 2 });
      const plano = await Plano.findOneAndUpdate(
        { nome: `${modalidades[i]} ${OPCOES_DURACAO_MESES[i % 4]} meses` },
        {
          $setOnInsert: {
            modalidade: modalidade._id,
            valorMensal: 99.9 + i * 20,
            duracaoMeses: OPCOES_DURACAO_MESES[i % 4],
            ativo: true,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ).collation({ locale: 'pt', strength: 2 });
      // Preserve existing students' enrolments and all existing user-entered data.
      if (!(await Matricula.exists({ aluno: aluno._id })))
        await Matricula.create({
          aluno: aluno._id,
          instrutor: instrutor._id,
          plano: plano._id,
          dataInicio: new Date(hoje()),
          status: (
            ['ativa', 'trancada', 'cancelada', 'ativa', 'trancada'] as const
          )[i],
        });
    }
    for (const perfil of ['admin', 'atendente', 'consulta'] as const) {
      const email = `${perfil}@sistema.com`;
      if (!(await Usuario.exists({ email })))
        await Usuario.create({
          nome: perfil === 'admin' ? 'Administrador' : perfil,
          email,
          senhaHash: await bcrypt.hash(
            process.env.SEED_PASSWORD ?? 'Admin@123',
            10,
          ),
          perfil,
          ativo: true,
        });
    }
    console.log(
      'Seed concluído: pelo menos 5 registros em cada cadastro e usuários admin, atendente e consulta. Dados existentes preservados.',
    );
  } finally {
    await mongoose.disconnect();
  }
}
if (require.main === module)
  void seed().catch((erro: unknown) => {
    console.error(
      'Não foi possível executar o seed:',
      erro instanceof Error ? erro.message : 'Erro desconhecido',
    );
    process.exitCode = 1;
  });
