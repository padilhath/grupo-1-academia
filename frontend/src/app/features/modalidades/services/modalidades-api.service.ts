import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { tratarErroApi } from '../../../core/http/tratar-erro-api';
import { Modalidade, ModalidadeEntrada, Intensidade } from '../modalidade.model';
import { ModalidadesService } from './modalidades.service';
@Injectable()
export class ModalidadesApiService extends ModalidadesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/modalidades`;
  listar(intensidade?: Intensidade, todos = false): Observable<Modalidade[]> {
    let params = new HttpParams();
    if (intensidade !== undefined) params = params.set('intensidade', intensidade);
    if (todos) params = params.set('todos', true);
    return this.http.get<RespostaApi<Modalidade[]>>(this.url, { params }).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  buscarPorId(id: string): Observable<Modalidade> {
    return this.http.get<RespostaApi<Modalidade>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  criar(dados: ModalidadeEntrada): Observable<Modalidade> {
    return this.http.post<RespostaApi<Modalidade>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  atualizar(id: string, dados: Partial<ModalidadeEntrada>): Observable<Modalidade> {
    return this.http.patch<RespostaApi<Modalidade>>(`${this.url}/${id}`, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(tratarErroApi));
  }
}
