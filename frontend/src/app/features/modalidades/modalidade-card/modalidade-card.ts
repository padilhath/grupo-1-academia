import { AuthService } from '../../../core/auth/auth.service';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Modalidade } from '../modalidade.model';

@Component({
  selector: 'app-modalidade-card',
  imports: [RouterLink],
  templateUrl: './modalidade-card.html',
})
export class ModalidadeCard {
  protected readonly auth = inject(AuthService);
  readonly modalidade = input.required<Modalidade>();

  readonly excluir = output<Modalidade>();

  protected pedirExclusao(): void {
    this.excluir.emit(this.modalidade());
  }
}
