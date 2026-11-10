export const OPCOES_INTENSIDADE = ['leve', 'moderada', 'intensa'] as const;
export type Intensidade = (typeof OPCOES_INTENSIDADE)[number];
export interface Modalidade {
  _id: string;
  nome: string;
  descricao?: string;
  intensidade: Intensidade;
  capacidadeMaxima: number;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ModalidadeEntrada {
  nome: string;
  descricao?: string;
  intensidade: Intensidade;
  capacidadeMaxima: number;
  ativo?: boolean;
}
