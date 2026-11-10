import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AlunosService } from './alunos.service';
import { Aluno } from './schemas/aluno.schema';

const consulta = <T>(valor: T) => ({
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(valor),
});
describe('AlunosService', () => {
  const id = new Types.ObjectId().toString();
  const outroId = new Types.ObjectId().toString();
  const dto = {
    nome: 'Maria Souza',
    email: 'maria@exemplo.com',
    telefone: '(51) 99999-9999',
    dataNascimento: '2000-05-10',
    objetivo: 'saude' as const,
  };
  const registro = { ...dto, _id: id, ativo: true };
  const model = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };
  const referencias = { buscarPorId: jest.fn() };
  let service: AlunosService;
  beforeEach(async () => {
    jest.resetAllMocks();
    model.find.mockReturnValue(consulta([registro]));
    model.findById.mockReturnValue(consulta(registro));
    model.findOne.mockReturnValue(consulta(null));
    model.create.mockResolvedValue({ _id: id, toObject: () => registro });
    model.findByIdAndUpdate.mockReturnValue(consulta(registro));
    referencias.buscarPorId.mockResolvedValue({ ativo: true });
    const modulo = await Test.createTestingModule({
      providers: [
        AlunosService,
        { provide: getModelToken(Aluno.name), useValue: model },
      ],
    }).compile();
    service = modulo.get(AlunosService);
  });
  it('filtra os ativos pelo campo do módulo', async () => {
    await expect(service.listar('saude')).resolves.toEqual([registro]);
    expect(model.find).toHaveBeenCalledWith({ ativo: true, objetivo: 'saude' });
  });
  it('inclui inativos apenas quando solicitado', async () => {
    await service.listar(undefined, true);
    expect(model.find).toHaveBeenCalledWith({});
  });
  it('cria registro válido', async () => {
    await expect(service.criar(dto)).resolves.toEqual(registro);
  });
  it('valida ID malformado com 400 sem consultar banco', async () => {
    await expect(service.buscarPorId('abc')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(model.findById).not.toHaveBeenCalled();
  });
  it('retorna 404 para registro inexistente', async () => {
    model.findById.mockReturnValue(consulta(null));
    await expect(service.buscarPorId(id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
  it('edita o próprio registro sem conflito consigo mesmo', async () => {
    model.findOne.mockReturnValue(consulta({ _id: id }));
    await expect(service.atualizar(id, dto)).resolves.toEqual(registro);
  });
  it('inativa sem excluir fisicamente', async () => {
    await service.remover(id);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      { $set: { ativo: false } },
      { returnDocument: 'after', runValidators: true },
    );
  });
  it('impede email duplicado na criação e na edição', async () => {
    model.findOne.mockReturnValue(consulta({ _id: outroId }));
    await expect(service.criar(dto)).rejects.toBeInstanceOf(ConflictException);
    await expect(
      service.atualizar(id, { email: dto.email }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(model.create).not.toHaveBeenCalled();
    expect(model.findByIdAndUpdate).not.toHaveBeenCalled();
  });
  it('recusa aluno menor de 14 anos inclusive na edição', async () => {
    await expect(
      service.criar({
        ...dto,
        dataNascimento: new Date().toISOString().slice(0, 10),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.atualizar(id, {
        dataNascimento: new Date().toISOString().slice(0, 10),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(model.create).not.toHaveBeenCalled();
  });
});
