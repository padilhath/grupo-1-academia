import { Component, input } from '@angular/core';
@Component({
  selector: 'app-resumo-card',
  template: `<article class="cartao indicador">
    <h2>{{ titulo() }}</h2>
    <p>{{ valor() }}</p>
  </article>`,
})
export class ResumoCard {
  readonly titulo = input.required<string>();
  readonly valor = input.required<number>();
}
