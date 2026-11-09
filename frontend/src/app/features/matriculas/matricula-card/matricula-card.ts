import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Matricula } from '../matricula.model';

/**
 * Componente REUTILIZÁVEL: mostra uma matrícula em formato de cartão (PDF 02, cap. 4 e 5).
 * - Recebe dados do componente pai com input()  → [matricula]="p"
 * - Avisa o pai que algo aconteceu com output() → (excluir)="excluir($event)"
 * Ele não sabe de onde vêm os produtos nem como excluir: quem decide é o pai.
 */
@Component({
  selector: 'app-matricula-card',
  imports: [RouterLink],
  templateUrl: './matricula-card.html',
})
export class MatriculaCard {
  /** Obrigatório: o pai SEMPRE precisa informar o produto. */
  readonly matricula = input.required<Matricula>();

  /** Evento que o cartão emite quando o usuário clica em "Excluir". */
  readonly excluir = output<Matricula>();

  protected pedirExclusao(): void {
    this.excluir.emit(this.matricula());
  }
}
