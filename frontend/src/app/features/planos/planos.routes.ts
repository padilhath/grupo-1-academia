import { edicaoGuard } from '../../core/auth/auth.guard';
import { Routes } from '@angular/router';
import { PlanoForm } from './plano-form/plano-form';
import { PlanosLista } from './plano-lista/plano-lista';

export const PLANOS_ROUTES: Routes = [
  { path: '', component: PlanosLista, title: 'Planos' },
  { path: 'novo', canActivate: [edicaoGuard], component: PlanoForm, title: 'Novo plano' },
  { path: ':id/editar', canActivate: [edicaoGuard], component: PlanoForm, title: 'Editar plano' },
];
