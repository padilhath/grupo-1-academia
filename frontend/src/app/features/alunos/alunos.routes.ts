import { Routes } from '@angular/router';
import { AlunosLista } from './alunos-lista/alunos-lista';
import { AlunoForm } from './aluno-form/aluno-form';

export const ALUNOS_ROUTES: Routes = [
  { path: '', component: AlunosLista, title: 'Alunos' },
  { path: 'novo', component: AlunoForm, title: 'Novo aluno' },
  { path: ':id/editar', component: AlunoForm, title: 'Editar aluno' },
];