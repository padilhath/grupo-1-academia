import { edicaoGuard } from '../../core/auth/auth.guard';
import { Routes } from '@angular/router';
import { AlunosLista } from './alunos-lista/alunos-lista';
import { AlunoForm } from './aluno-form/aluno-form';

export const ALUNOS_ROUTES: Routes = [
  { path: '', component: AlunosLista, title: 'Alunos' },
  { path: 'novo', canActivate: [edicaoGuard], component: AlunoForm, title: 'Novo aluno' },
  { path: ':id/editar', canActivate: [edicaoGuard], component: AlunoForm, title: 'Editar aluno' },
];
