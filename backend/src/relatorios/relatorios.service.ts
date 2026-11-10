import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Aluno, type AlunoDocument } from '../alunos/schemas/aluno.schema';
import {
  Matricula,
  type MatriculaDocument,
} from '../matriculas/schemas/matricula.schema';
@Injectable()
export class RelatoriosService {
  constructor(
    @InjectModel(Aluno.name) private readonly alunos: Model<AlunoDocument>,
    @InjectModel(Matricula.name)
    private readonly matriculas: Model<MatriculaDocument>,
  ) {}
  async resumo() {
    const [alunos, matriculasAtivas, matriculasTrancadas] = await Promise.all([
      this.alunos.countDocuments({ ativo: true }).exec(),
      this.matriculas.countDocuments({ status: 'ativa' }).exec(),
      this.matriculas.countDocuments({ status: 'trancada' }).exec(),
    ]);
    return { alunos, matriculasAtivas, matriculasTrancadas };
  }
  async receitaPorPlano() {
    return this.matriculas
      .aggregate<{ plano: string; matriculas: number; receitaMensal: number }>([
        { $match: { status: 'ativa' } },
        {
          $lookup: {
            from: 'planos',
            localField: 'plano',
            foreignField: '_id',
            as: 'p',
          },
        },
        { $unwind: '$p' },
        {
          $group: {
            _id: '$p.nome',
            matriculas: { $sum: 1 },
            receitaMensal: { $sum: '$p.valorMensal' },
          },
        },
        {
          $project: {
            _id: 0,
            plano: '$_id',
            matriculas: 1,
            receitaMensal: { $round: ['$receitaMensal', 2] },
          },
        },
        { $sort: { receitaMensal: -1, plano: 1 } },
      ])
      .exec();
  }
  async alunosPorObjetivo() {
    return this.alunos
      .aggregate<{ _id: string; quantidade: number }>([
        { $match: { ativo: true } },
        { $group: { _id: '$objetivo', quantidade: { $sum: 1 } } },
        { $sort: { quantidade: -1, _id: 1 } },
      ])
      .exec();
  }
}
