import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RespostaApi } from '../models/resposta-api';
import { tratarErroApi } from '../http/tratar-erro-api';
export type Perfil = 'admin' | 'atendente' | 'consulta';
export interface Usuario {
  _id: string;
  nome: string;
  perfil: Perfil;
}
export interface Sessao {
  accessToken: string;
  usuario: Usuario;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly token = signal<string | null>(sessionStorage.getItem('academia.token'));
  readonly usuario = signal<Usuario | null>(null);
  readonly autenticado = computed(() => !!this.token() && !!this.usuario());
  readonly admin = computed(() => this.usuario()?.perfil === 'admin');
  readonly podeEditar = computed(() =>
    ['admin', 'atendente'].includes(this.usuario()?.perfil ?? ''),
  );
  private expiracao?: ReturnType<typeof setTimeout>;

  restaurar(): Observable<void> {
    if (!this.token()) return of(undefined);
    return this.http.get<RespostaApi<Usuario>>(`${environment.apiUrl}/auth/me`).pipe(
      tap((r) => {
        this.usuario.set(r.dados);
        this.agendarExpiracao();
      }),
      map(() => undefined),
      catchError(() => {
        this.limpar();
        return of(undefined);
      }),
    );
  }
  login(email: string, senha: string): Observable<Sessao> {
    return this.http
      .post<RespostaApi<Sessao>>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(
        map((r) => r.dados),
        tap((sessao) => {
          this.token.set(sessao.accessToken);
          this.usuario.set(sessao.usuario);
          sessionStorage.setItem('academia.token', sessao.accessToken);
          this.agendarExpiracao();
        }),
        catchError(tratarErroApi),
      );
  }
  cadastrar(
    dados: { nome: string; email: string; senha: string },
    perfil?: Perfil,
  ): Observable<unknown> {
    const url = perfil ? `${environment.apiUrl}/usuarios` : `${environment.apiUrl}/auth/cadastro`;
    return this.http
      .post(url, perfil ? { ...dados, perfil } : dados)
      .pipe(catchError(tratarErroApi));
  }
  logout(): void {
    this.limpar();
    void this.router.navigate(['/login']);
  }
  private limpar(): void {
    clearTimeout(this.expiracao);
    this.token.set(null);
    this.usuario.set(null);
    sessionStorage.removeItem('academia.token');
  }
  private agendarExpiracao(): void {
    clearTimeout(this.expiracao);
    try {
      const payload = JSON.parse(
        atob(this.token()!.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      ) as { exp: number };
      const restante = payload.exp * 1000 - Date.now();
      if (!Number.isFinite(restante) || restante <= 0) {
        this.logout();
        return;
      }
      this.expiracao = setTimeout(() => this.logout(), Math.min(restante, 2147483647));
    } catch {
      this.logout();
    }
  }
}
