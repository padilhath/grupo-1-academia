import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const daApi = req.url.startsWith(`${environment.apiUrl}/`);
  const requisicao =
    daApi && auth.token()
      ? req.clone({ setHeaders: { Authorization: `Bearer ${auth.token()}` } })
      : req;
  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (daApi && erro.status === 401 && !req.url.endsWith('/auth/login')) auth.logout();
      return throwError(() => erro);
    }),
  );
};
