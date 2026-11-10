import { Observable } from 'rxjs';
import { Aluno, AlunoEntrada, Objetivo } from '../aluno.model';
export abstract class AlunosService {
  abstract listar(objetivo?: Objetivo, todos?: boolean): Observable<Aluno[]>;
  abstract buscarPorId(id: string): Observable<Aluno>;
  abstract criar(dados: AlunoEntrada): Observable<Aluno>;
  abstract atualizar(id: string, dados: Partial<AlunoEntrada>): Observable<Aluno>;
  abstract remover(id: string): Observable<void>;
}
