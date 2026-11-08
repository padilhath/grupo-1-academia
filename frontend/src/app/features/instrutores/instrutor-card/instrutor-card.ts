import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Instrutor } from '../instrutor.model';

/**
 * Componente REUTILIZÁVEL: mostra um produto em formato de cartão (PDF 02, cap. 4 e 5).
 * - Recebe dados do componente pai com input()  → [produto]="p"
 * - Avisa o pai que algo aconteceu com output() → (excluir)="excluir($event)"
 * Ele não sabe de onde vêm os produtos nem como excluir: quem decide é o pai.
 */
@Component({
  selector: 'app-instrutor-card',
  imports: [RouterLink],
  templateUrl: './instrutor-card.html',
})
export class InstrutorCard {
  /** Obrigatório: o pai SEMPRE precisa informar o produto. */
  readonly instrutor = input.required<Instrutor>();

  /** Evento que o cartão emite quando o usuário clica em "Excluir". */
  readonly excluir = output<Instrutor>();

  protected pedirExclusao(): void {
    this.excluir.emit(this.instrutor());
  }
}
