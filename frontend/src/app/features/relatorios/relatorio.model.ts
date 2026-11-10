import { Objetivo } from '../alunos/aluno.model';
export interface Resumo {
  alunos: number;
  matriculasAtivas: number;
  matriculasTrancadas: number;
}
export interface ReceitaPorPlano {
  plano: string;
  matriculas: number;
  receitaMensal: number;
}
export interface AlunosPorObjetivo {
  _id: Objetivo;
  quantidade: number;
}
export interface Painel {
  resumo: Resumo;
  receitaPorPlano: ReceitaPorPlano[];
  alunosPorObjetivo: AlunosPorObjetivo[];
}
