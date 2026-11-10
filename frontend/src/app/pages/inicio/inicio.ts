import { AuthService } from '../../core/auth/auth.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RelatoriosPainel } from '../../features/relatorios/relatorios-painel/relatorios-painel';
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, RelatoriosPainel],
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly auth = inject(AuthService);
}
