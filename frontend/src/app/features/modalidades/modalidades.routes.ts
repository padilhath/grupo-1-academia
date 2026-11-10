import { edicaoGuard } from '../../core/auth/auth.guard';
import { Routes } from '@angular/router';
import { ModalidadeForm } from './modalidade-form/modalidade-form';
import { ModalidadesLista } from './modalidades-lista/modalidades-lista';

export const MODALIDADES_ROUTES: Routes = [
  { path: '', component: ModalidadesLista, title: 'Modalidades' },
  { path: 'novo', canActivate: [edicaoGuard], component: ModalidadeForm, title: 'Nova modalidade' },
  {
    path: ':id/editar',
    canActivate: [edicaoGuard],
    component: ModalidadeForm,
    title: 'Editar modalidade',
  },
];
