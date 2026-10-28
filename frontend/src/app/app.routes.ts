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
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Inicio, title: 'Início' },
      {
        path: 'planos',
        loadChildren: () => import('./features/planos/planos.routes').then((m) => m.PLANOS_ROUTES),
      },
      // TODO (aula 02): cada aluno adiciona aqui a rota do seu módulo, ex.:
      // { path: 'pets', loadChildren: () => import('./features/pets/pets.routes').then((m) => m.PETS_ROUTES) },
    ],
  },
  { path: '**', component: NaoEncontrado, title: 'Página não encontrada' },
];
