import { edicaoGuard } from '../../core/auth/auth.guard';
import { Routes } from '@angular/router';
import { InstrutorForm } from './instrutor-form/instrutor-form';
import { InstrutoresLista } from './instrutor-lista/instrutor-lista';

export const INSTRUTORES_ROUTES: Routes = [
  { path: '', component: InstrutoresLista, title: 'Instrutores' },
  { path: 'novo', canActivate: [edicaoGuard], component: InstrutorForm, title: 'Novo instrutor' },
  {
    path: ':id/editar',
    canActivate: [edicaoGuard],
    component: InstrutorForm,
    title: 'Editar instrutor',
  },
];
