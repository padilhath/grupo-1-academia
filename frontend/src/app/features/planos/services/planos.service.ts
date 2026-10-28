import { Observable } from 'rxjs';
import { DuracaoMeses, Plano, PlanoEntrada } from '../plano.model';

/**
 * CONTRATO do serviço de produtos.
 * Os componentes dependem só desta classe abstrata.
 * Quem decide se os dados vêm do mock ou da API é o app.config.ts.
 * Assim, trocar o mock pela API (aula 13) não exige mexer nos componentes.
 */
export abstract class PlanosService {
  abstract listar(DuracaoMeses?: DuracaoMeses): Observable<Plano[]>;
  abstract buscarPorId(id: string): Observable<Plano>;
  abstract criar(dados: PlanoEntrada): Observable<Plano>;
  abstract atualizar(id: string, dados: Partial<PlanoEntrada>): Observable<Plano>;
  abstract remover(id: string): Observable<void>;
}
