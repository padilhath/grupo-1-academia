import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
export function tratarErroApi(erro: HttpErrorResponse): Observable<never> {
  const corpo = erro.error as { message?: string | string[] } | null;
  let mensagem = 'Não foi possível falar com o servidor. Verifique a conexão e tente novamente.';
  if (erro.status === 403) mensagem = 'Seu perfil não tem permissão para esta ação.';
  else if (erro.status >= 500) mensagem = 'Erro interno. Tente novamente mais tarde.';
  else if (erro.status > 0 && corpo?.message)
    mensagem = Array.isArray(corpo.message) ? corpo.message.join(' · ') : corpo.message;
  return throwError(() => new Error(mensagem));
}
