import { Observable } from 'rxjs';
import { Turno, Instrutor, InstrutorEntrada } from '../instrutor.model';

/**
 * CONTRATO do serviço de instrutores.
 * Os componentes dependem só desta classe abstrata.
 * Quem decide se os dados vêm do mock ou da API é o app.config.ts.
 * Assim, trocar o mock pela API (aula 13) não exige mexer nos componentes.
 */
export abstract class InstrutoresService {
  abstract listar(turno?: Turno): Observable<Instrutor[]>;
  abstract buscarPorId(id: string): Observable<Instrutor>;
  abstract criar(dados: InstrutorEntrada): Observable<Instrutor>;
  abstract atualizar(id: string, dados: Partial<InstrutorEntrada>): Observable<Instrutor>;
  abstract remover(id: string): Observable<void>;
}
