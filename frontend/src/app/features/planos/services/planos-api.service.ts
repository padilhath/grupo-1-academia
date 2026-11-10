import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { tratarErroApi } from '../../../core/http/tratar-erro-api';
import { Plano, PlanoEntrada, DuracaoMeses } from '../plano.model';
import { PlanosService } from './planos.service';
@Injectable()
export class PlanosApiService extends PlanosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/planos`;
  listar(duracaoMeses?: DuracaoMeses, todos = false): Observable<Plano[]> {
    let params = new HttpParams();
    if (duracaoMeses !== undefined) params = params.set('duracaoMeses', duracaoMeses);
    if (todos) params = params.set('todos', true);
    return this.http.get<RespostaApi<Plano[]>>(this.url, { params }).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  buscarPorId(id: string): Observable<Plano> {
    return this.http.get<RespostaApi<Plano>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  criar(dados: PlanoEntrada): Observable<Plano> {
    return this.http.post<RespostaApi<Plano>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  atualizar(id: string, dados: Partial<PlanoEntrada>): Observable<Plano> {
    return this.http.patch<RespostaApi<Plano>>(`${this.url}/${id}`, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(tratarErroApi));
  }
}
