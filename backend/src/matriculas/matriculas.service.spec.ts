import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MatriculasService } from './matriculas.service';
import { Matricula } from './schemas/matricula.schema';
import { AlunosService } from '../alunos/alunos.service';
import { PlanosService } from '../planos/planos.service';
import { InstrutoresService } from '../instrutores/instrutores.service';
const consulta = <T>(v: T) => ({
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(v),
});
describe('MatriculasService', () => {
  const id = new Types.ObjectId().toString();
  const dto = { aluno: id, plano: id, instrutor: id, dataInicio: '2099-12-01' };
  const registro = {
    ...dto,
    _id: id,
    status: 'ativa',
    dataInicio: new Date(dto.dataInicio),
  };
  const model = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };
  const refs = { buscarPorId: jest.fn() };
  let service: MatriculasService;
  beforeEach(async () => {
    jest.resetAllMocks();
    refs.buscarPorId.mockResolvedValue({ ativo: true });
    model.find.mockReturnValue(consulta([registro]));
    model.findById.mockReturnValue(consulta(registro));
    model.findOne.mockReturnValue(consulta(null));
    model.create.mockResolvedValue({ _id: id, toObject: () => registro });
    model.findOneAndUpdate.mockReturnValue(consulta(registro));
    const modulo = await Test.createTestingModule({
      providers: [
        MatriculasService,
        { provide: getModelToken(Matricula.name), useValue: model },
        ...[AlunosService, PlanosService, InstrutoresService].map(
          (provide) => ({ provide, useValue: refs }),
        ),
      ],
    }).compile();
    service = modulo.get(MatriculasService);
  });
  it('lista pelo status com populate', async () => {
    await expect(service.listar('ativa')).resolves.toEqual([registro]);
    expect(model.find).toHaveBeenCalledWith({ status: 'ativa' });
  });
  it('cria matrícula válida', async () => {
    await expect(service.criar(dto)).resolves.toEqual(registro);
    expect(model.create).toHaveBeenCalledWith({ ...dto, status: 'ativa' });
  });
  it('valida ID malformado', async () => {
    await expect(service.buscarPorId('abc')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
  it('retorna 404 quando não existe', async () => {
    model.findById.mockReturnValue(consulta(null));
    await expect(service.buscarPorId(id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
  it('impede segunda matrícula ativa', async () => {
    model.findOne.mockReturnValue(consulta({ _id: new Types.ObjectId() }));
    await expect(service.criar(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(model.create).not.toHaveBeenCalled();
  });
  it('impede data passada', async () => {
    await expect(
      service.criar({ ...dto, dataInicio: '2000-01-01' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  it('valida referência inexistente', async () => {
    refs.buscarPorId.mockRejectedValue(new NotFoundException());
    await expect(service.criar(dto)).rejects.toBeInstanceOf(NotFoundException);
  });
  it('valida referência inativa', async () => {
    refs.buscarPorId.mockResolvedValue({ ativo: false });
    await expect(service.criar(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
  it('permite trancar usando comparação atômica do estado', async () => {
    await service.mudarStatus(id, 'trancada');
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id, status: 'ativa' },
      { $set: { status: 'trancada' } },
      { returnDocument: 'after', runValidators: true },
    );
  });
  it('recusa transição de cancelada para ativa', async () => {
    model.findById.mockReturnValue(
      consulta({ ...registro, status: 'cancelada' }),
    );
    await expect(service.mudarStatus(id, 'ativa')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
  it('recusa reativar se outra matrícula já está ativa', async () => {
    model.findById.mockReturnValue(
      consulta({ ...registro, status: 'trancada' }),
    );
    model.findOne.mockReturnValue(consulta({ _id: new Types.ObjectId() }));
    await expect(service.mudarStatus(id, 'ativa')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
  it('informa conflito se o estado mudou durante a operação', async () => {
    model.findOneAndUpdate.mockReturnValue(consulta(null));
    await expect(service.mudarStatus(id, 'trancada')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
  it('preserva data histórica ao editar sem alterá-la', async () => {
    model.findById.mockReturnValue(
      consulta({ ...registro, dataInicio: new Date('2000-01-01') }),
    );
    await expect(
      service.atualizar(id, { dataInicio: '2000-01-01' }),
    ).resolves.toBeDefined();
  });
});
