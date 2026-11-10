import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Aluno } from '../alunos/schemas/aluno.schema';
import { Matricula } from '../matriculas/schemas/matricula.schema';
import { RelatoriosService } from './relatorios.service';
describe('RelatoriosService', () => {
  const alunos = { countDocuments: jest.fn(), aggregate: jest.fn() };
  const matriculas = { countDocuments: jest.fn(), aggregate: jest.fn() };
  let service: RelatoriosService;
  beforeEach(async () => {
    jest.resetAllMocks();
    alunos.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(5),
    });
    matriculas.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(2),
    });
    alunos.aggregate.mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
    matriculas.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
    });
    const modulo = await Test.createTestingModule({
      providers: [
        RelatoriosService,
        { provide: getModelToken(Aluno.name), useValue: alunos },
        { provide: getModelToken(Matricula.name), useValue: matriculas },
      ],
    }).compile();
    service = modulo.get(RelatoriosService);
  });
  it('retorna os três totais filtrados', async () => {
    await expect(service.resumo()).resolves.toEqual({
      alunos: 5,
      matriculasAtivas: 2,
      matriculasTrancadas: 2,
    });
    expect(alunos.countDocuments).toHaveBeenCalledWith({ ativo: true });
    expect(matriculas.countDocuments).toHaveBeenCalledWith({ status: 'ativa' });
    expect(matriculas.countDocuments).toHaveBeenCalledWith({
      status: 'trancada',
    });
  });
  it('agrupa receita de matrículas ativas usando lookup de planos', async () => {
    await expect(service.receitaPorPlano()).resolves.toEqual([]);
    expect(matriculas.aggregate).toHaveBeenCalledWith(
      expect.arrayContaining([
        { $match: { status: 'ativa' } },
        {
          $lookup: {
            from: 'planos',
            localField: 'plano',
            foreignField: '_id',
            as: 'p',
          },
        },
      ]),
    );
  });
  it('agrupa somente alunos ativos', async () => {
    await expect(service.alunosPorObjetivo()).resolves.toEqual([]);
    expect(alunos.aggregate).toHaveBeenCalledWith(
      expect.arrayContaining([
        { $match: { ativo: true } },
        { $group: { _id: '$objetivo', quantidade: { $sum: 1 } } },
      ]),
    );
  });
  it('devolve o resultado agregado sem inventar dados quando vazio', async () => {
    matriculas.aggregate.mockReturnValue({
      exec: jest
        .fn()
        .mockResolvedValue([
          { plano: 'Pilates', matriculas: 2, receitaMensal: 300 },
        ]),
    });
    await expect(service.receitaPorPlano()).resolves.toEqual([
      { plano: 'Pilates', matriculas: 2, receitaMensal: 300 },
    ]);
  });
});
