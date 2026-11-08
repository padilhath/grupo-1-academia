import { Routes } from '@angular/router';
import { InstrutorForm } from './instrutor-form/instrutor-form';
import { InstrutoresLista } from './instrutor-lista/instrutor-lista';

export const INSTRUTORES_ROUTES: Routes = [
  { path: '', component: InstrutoresLista, title: 'Instrutores' },
  { path: 'novo', component: InstrutorForm, title: 'Novo instrutor' },
  { path: ':id/editar', component: InstrutorForm, title: 'Editar instrutor' },
];
