import { authGuard, adminGuard } from './core/auth/auth.guard';
import { AcessoNegado } from './pages/acesso-negado/acesso-negado';
import { AuthForm } from './features/auth/auth-form';
import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Inicio } from './pages/inicio/inicio';
import { NaoEncontrado } from './pages/nao-encontrado/nao-encontrado';

/**
 * Mapa de rotas da aplicação (PDF 02, cap. 10).
 * Na aula 12/13, as rotas internas passam a ser protegidas por um guard
 * e surge a rota pública /login.
 */
export const routes: Routes = [
  { path: 'login', component: AuthForm, title: 'Entrar' },
  { path: 'cadastro', component: AuthForm, data: { cadastro: true }, title: 'Criar conta' },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: Inicio, title: 'Início' },
      { path: 'acesso-negado', component: AcessoNegado, title: 'Acesso negado' },
      {
        path: 'usuarios/novo',
        component: AuthForm,
        canActivate: [adminGuard],
        data: { cadastro: true, administrativo: true },
        title: 'Novo usuário',
      },
      {
        path: 'relatorios',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./features/relatorios/relatorios.routes').then((m) => m.RELATORIOS_ROUTES),
      },
      {
        path: 'alunos',
        loadChildren: () => import('./features/alunos/alunos.routes').then((m) => m.ALUNOS_ROUTES),
      },
      {
        path: 'planos',
        loadChildren: () => import('./features/planos/planos.routes').then((m) => m.PLANOS_ROUTES),
      },
      {
        path: 'instrutores',
        loadChildren: () =>
          import('./features/instrutores/instrutores.routes').then((m) => m.INSTRUTORES_ROUTES),
      },
      {
        path: 'modalidades',
        loadChildren: () =>
          import('./features/modalidades/modalidades.routes').then((m) => m.MODALIDADES_ROUTES),
      },
      {
        path: 'matriculas',
        loadChildren: () =>
          import('./features/matriculas/matriculas.routes').then((m) => m.MATRICULAS_ROUTES),
      },
    ],
  },
  { path: '**', component: NaoEncontrado, title: 'Página não encontrada' },
];
