import { edicaoGuard } from '../../core/auth/auth.guard';
import { Routes } from '@angular/router';
import { MatriculasLista } from './matricula-lista/matriculas-lista';
import { MatriculaForm } from './matricula-form/matricula-form';

export const MATRICULAS_ROUTES: Routes = [
  {
    path: '',
    component: MatriculasLista,
    title: 'Matrículas',
  },
  {
    path: 'novo',
    canActivate: [edicaoGuard],
    component: MatriculaForm,
    title: 'Nova matrícula',
  },
  {
    path: ':id/editar',
    canActivate: [edicaoGuard],
    component: MatriculaForm,
    title: 'Editar matrícula',
  },
];
