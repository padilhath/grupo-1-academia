import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = (_route, state) =>
  inject(AuthService).autenticado() ||
  inject(Router).createUrlTree(['/login'], { queryParams: { retorno: state.url } });
export const edicaoGuard: CanActivateFn = () =>
  inject(AuthService).podeEditar() || inject(Router).createUrlTree(['/acesso-negado']);
export const adminGuard: CanActivateFn = () =>
  inject(AuthService).admin() || inject(Router).createUrlTree(['/acesso-negado']);
