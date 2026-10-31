import { Referencia } from '../../core/models/referencia';

export const STATUS = ['ativa', 'trancada', 'cancelada'] as const;

export type Status = (typeof STATUS)[number];

export const TRANSICOES: Record<Status, Status[]> = {
  ativa: ['trancada', 'cancelada'],
  trancada: ['ativa', 'cancelada'],
  cancelada: [],
};

export interface Matricula {
  _id: string;
  aluno: Referencia;
  plano: Referencia;
  instrutor: Referencia;
  dataInicio: string;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}

export interface MatriculaEntrada {
  aluno: string;
  plano: string;
  instrutor: string;
  dataInicio: string;
}
