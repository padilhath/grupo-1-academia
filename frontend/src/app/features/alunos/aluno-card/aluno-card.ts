import { AuthService } from '../../../core/auth/auth.service';
import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Aluno } from '../aluno.model';

@Component({
  selector: 'app-aluno-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './aluno-card.html',
})
export class AlunoCard {
  protected readonly auth = inject(AuthService);
  readonly aluno = input.required<Aluno>();

  readonly excluir = output<Aluno>();

  protected pedirExclusao(): void {
    this.excluir.emit(this.aluno());
  }
}
