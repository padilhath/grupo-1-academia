import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { tratarErroApi } from '../../../core/http/tratar-erro-api';
import { Matricula, MatriculaEntrada, Status } from '../matricula.model';
import { MatriculasService } from './matriculas.service';
@Injectable()
export class MatriculasApiService extends MatriculasService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/matriculas`;
  listar(status?: Status): Observable<Matricula[]> {
    let params = new HttpParams();
    if (status !== undefined) params = params.set('status', status);

    return this.http.get<RespostaApi<Matricula[]>>(this.url, { params }).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  buscarPorId(id: string): Observable<Matricula> {
    return this.http.get<RespostaApi<Matricula>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  criar(dados: MatriculaEntrada): Observable<Matricula> {
    return this.http.post<RespostaApi<Matricula>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  atualizar(id: string, dados: Partial<MatriculaEntrada>): Observable<Matricula> {
    return this.http.patch<RespostaApi<Matricula>>(`${this.url}/${id}`, dados).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
  remover(id: string): Observable<void> {
    return this.mudarStatus(id, 'cancelada').pipe(map(() => undefined));
  }
  mudarStatus(id: string, status: Status): Observable<Matricula> {
    return this.http.patch<RespostaApi<Matricula>>(`${this.url}/${id}/status`, { status }).pipe(
      map((r) => r.dados),
      catchError(tratarErroApi),
    );
  }
}
