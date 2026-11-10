import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { tratarErroApi } from '../../../core/http/tratar-erro-api';
import { Instrutor, InstrutorEntrada, Turno } from '../instrutor.model';
import { InstrutoresService } from './instrutores.service';
@Injectable()
export class InstrutoresApiService extends InstrutoresService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/instrutores`;
  listar(turno?: Turno, todos = false): Observable<Instrutor[]> {
    let params = new HttpParams();
    if (turno !== undefined) params = params.set('turno', turno);
    if (todos) params = params.set('todos', true);
    return this.http.get<RespostaApi<Instrutor[]>>(this.url, { params }).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  buscarPorId(id: string): Observable<Instrutor> {
    return this.http.get<RespostaApi<Instrutor>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  criar(dados: InstrutorEntrada): Observable<Instrutor> {
    return this.http.post<RespostaApi<Instrutor>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  atualizar(id: string, dados: Partial<InstrutorEntrada>): Observable<Instrutor> {
    return this.http.patch<RespostaApi<Instrutor>>(`${this.url}/${id}`, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(tratarErroApi));
  }
}
