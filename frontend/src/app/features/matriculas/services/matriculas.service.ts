import { Observable } from 'rxjs';
import { Status, Matricula, MatriculaEntrada } from '../matricula.model';

/**
 * CONTRATO do serviço de matrículas.
 * Os componentes dependem só desta classe abstrata.
 * Quem decide se os dados vêm do mock ou da API é o app.config.ts.
 * Assim, trocar o mock pela API (aula 13) não exige mexer nos componentes.
 */
export abstract class MatriculasService {
  abstract listar(status?: Status): Observable<Matricula[]>;
  abstract buscarPorId(id: string): Observable<Matricula>;
  abstract criar(dados: MatriculaEntrada): Observable<Matricula>;
  abstract atualizar(id: string, dados: Partial<MatriculaEntrada>): Observable<Matricula>;
  abstract mudarStatus(id: string, status: Status): Observable<Matricula>;
  abstract remover(id: string): Observable<void>;
}
