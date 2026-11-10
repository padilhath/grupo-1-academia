import { AuthService } from '../../../core/auth/auth.service';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Instrutor } from '../instrutor.model';

@Component({
  selector: 'app-instrutor-card',
  imports: [RouterLink],
  templateUrl: './instrutor-card.html',
})
export class InstrutorCard {
  protected readonly auth = inject(AuthService);
  readonly instrutor = input.required<Instrutor>();

  readonly excluir = output<Instrutor>();

  protected pedirExclusao(): void {
    this.excluir.emit(this.instrutor());
  }
}
