import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { Turno, Instrutor, InstrutorEntrada } from '../instrutor.model';
import { InstrutoresService } from './instrutores.service';

/**
 * Serviço que conversa com a API NestJS de verdade (PDF 02, cap. 9).
 * Ativado quando environment.usarMock = false.
 */
@Injectable()
export class InstrutoresApiService extends InstrutoresService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/instrutores`;

  listar(turno?: Turno): Observable<Instrutor[]> {
    const params = turno ? new HttpParams().set('turno', turno) : undefined;
    return this.http.get<RespostaApi<Instrutor[]>>(this.url, { params }).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  buscarPorId(id: string): Observable<Instrutor> {
    return this.http.get<RespostaApi<Instrutor>>(`${this.url}/${id}`).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  criar(dados: InstrutorEntrada): Observable<Instrutor> {
    return this.http.post<RespostaApi<Instrutor>>(this.url, dados).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  atualizar(id: string, dados: Partial<InstrutorEntrada>): Observable<Instrutor> {
    return this.http.patch<RespostaApi<Instrutor>>(`${this.url}/${id}`, dados).pipe(
      map((r) => r.dados),
      catchError(this.tratarErro),
    );
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(catchError(this.tratarErro));
  }

  /** Converte o erro HTTP em uma mensagem amigável para a tela. */
  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    let mensagem = 'Não foi possível falar com o servidor. Tente novamente.';
    const corpo = erro.error as { message?: string | string[] } | null;
    if (erro.status > 0 && corpo?.message) {
      mensagem = Array.isArray(corpo.message) ? corpo.message.join(' · ') : corpo.message;
    }
    return throwError(() => new Error(mensagem));
  }
}
