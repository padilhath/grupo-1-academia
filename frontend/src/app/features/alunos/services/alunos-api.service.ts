import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { tratarErroApi } from '../../../core/http/tratar-erro-api';
import { Aluno, AlunoEntrada, Objetivo } from '../aluno.model';
import { AlunosService } from './alunos.service';
@Injectable()
export class AlunosApiService extends AlunosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/alunos`;
  listar(objetivo?: Objetivo, todos = false): Observable<Aluno[]> {
    let params = new HttpParams();
    if (objetivo !== undefined) params = params.set('objetivo', objetivo);
    if (todos) params = params.set('todos', true);
    return this.http.get<RespostaApi<Aluno[]>>(this.url, { params }).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  buscarPorId(id: string): Observable<Aluno> {
    return this.http.get<RespostaApi<Aluno>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  criar(dados: AlunoEntrada): Observable<Aluno> {
    return this.http.post<RespostaApi<Aluno>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  atualizar(id: string, dados: Partial<AlunoEntrada>): Observable<Aluno> {
    return this.http.patch<RespostaApi<Aluno>>(`${this.url}/${id}`, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(tratarErroApi));
  }
}
