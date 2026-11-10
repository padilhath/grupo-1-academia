import { Component, input } from '@angular/core';
@Component({
  selector: 'app-etiqueta',
  template: `<span class="etiqueta" [class.destaque]="destaque()">{{ texto() }}</span>`,
})
export class Etiqueta {
  readonly texto = input.required<string>();
  readonly destaque = input(false);
}
