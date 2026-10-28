// frontend/src/app/features/planos/plano.model.ts
import { Referencia } from '../../core/models/referencia';

export const OPCOES_DURACAO_MESES = [1, 3, 6, 12] as const;
export type DuracaoMeses = (typeof OPCOES_DURACAO_MESES)[number];

/** Plano como a API devolve (segue o contrato da API). */
export interface Plano {
  _id: string;
  nome: string;
  modalidade: Referencia; // _id ou { _id, nome } (populate)
  valorMensal: number;
  duracaoMeses: DuracaoMeses;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Dados enviados para criar ou editar. */
export interface PlanoEntrada {
  nome: string;
  modalidade: string; // _id do Modalidade
  valorMensal: number;
  duracaoMeses: DuracaoMeses;
  ativo?: boolean;
}
