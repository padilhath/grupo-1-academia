import { AuthService } from '../../../core/auth/auth.service';
import { textoDe } from '../../../core/models/referencia';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Matricula } from '../matricula.model';

@Component({
  selector: 'app-matricula-card',
  imports: [RouterLink],
  templateUrl: './matricula-card.html',
})
export class MatriculaCard {
  protected readonly auth = inject(AuthService);
  protected readonly textoDe = textoDe;
  readonly matricula = input.required<Matricula>();

  readonly cancelar = output<Matricula>();

  protected pedirExclusao(): void {
    this.cancelar.emit(this.matricula());
  }
}
