import { Routes } from '@angular/router';
import { MatriculasLista } from './matriculas-lista/matriculas-lista';
import { MatriculaForm } from './matricula-form/matricula-form';

export const MATRICULAS_ROUTES: Routes = [
  {
    path: '',
    component: MatriculasLista,
    title: 'Matrículas',
  },
  {
    path: 'novo',
    component: MatriculaForm,
    title: 'Nova matrícula',
  },
  {
    path: ':id/editar',
    component: MatriculaForm,
    title: 'Editar matrícula',
  },
];
