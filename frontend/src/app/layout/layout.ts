import { AuthService } from '../core/auth/auth.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/** Componente de layout: cabeçalho, menu lateral e área de conteúdo (PDF 02, cap. 4). */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  protected readonly auth = inject(AuthService);
  // TODO (aula 01/02): troque pelo nome do sistema do seu grupo
  protected readonly nomeSistema = 'Turma da Bomba — Academia';
}
