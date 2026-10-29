export const OPCOES_TURNO = ['manha', 'tarde', 'noite'] as const;
export type Turno = (typeof OPCOES_TURNO)[number];

/** Instrutor como a API devolve (segue o contrato da API). */
export interface Instrutor {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  cref: string;
  turno: Turno;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Dados enviados para criar ou editar. */
export interface InstrutorEntrada {
  nome: string;
  email: string;
  telefone: string;
  cref: string;
  turno: Turno;
  ativo?: boolean;
}
