import { AuthService } from '../../../core/auth/auth.service';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Plano } from '../plano.model';

@Component({
  selector: 'app-plano-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './plano-card.html',
})
export class PlanoCard {
  protected readonly auth = inject(AuthService);
  readonly plano = input.required<Plano>();

  readonly excluir = output<Plano>();

  protected pedirExclusao(): void {
    this.excluir.emit(this.plano());
  }
}
