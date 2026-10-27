export const OPCOES_OBJETIVO = [
  'emagrecimento',
  'hipertrofia',
  'condicionamento',
  'saude',
] as const;
export type Objetivo = (typeof OPCOES_OBJETIVO)[number];

export interface Aluno {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  objetivo: Objetivo;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlunoEntrada {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string; // ISO: '2026-11-20'
  objetivo: Objetivo;
  ativo?: boolean;
}

