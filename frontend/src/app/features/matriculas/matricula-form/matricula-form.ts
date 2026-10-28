import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { idDe } from '../../../core/models/referencia';
import { MatriculasMockService } from '../services/matriculas-mock.service';

@Component({
  selector: 'app-matricula-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './matricula-form.html',
})
export class MatriculaForm {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(MatriculasMockService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly erro = signal('');

  // TODO: carregar as opções dos serviços após o merge.
  protected readonly alunos = [
    { _id: '1', nome: 'Aluno de exemplo 1' },
    { _id: '2', nome: 'Aluno de exemplo 2' },
    { _id: '3', nome: 'Aluno de exemplo 3' },
  ];

  protected readonly planos = [
    { _id: '1', nome: 'Plano de exemplo 1' },
    { _id: '2', nome: 'Plano de exemplo 2' },
  ];

  protected readonly instrutores = [
    { _id: '1', nome: 'Instrutor de exemplo 1' },
    { _id: '2', nome: 'Instrutor de exemplo 2' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    aluno: ['', Validators.required],
    plano: ['', Validators.required],
    instrutor: ['', Validators.required],
    dataInicio: ['', Validators.required],
  });

  constructor() {
    if (this.id) {
      try {
        const matricula = this.service.buscarPorId(this.id);

        this.form.patchValue({
          aluno: idDe(matricula.aluno),
          plano: idDe(matricula.plano),
          instrutor: idDe(matricula.instrutor),
          dataInicio: matricula.dataInicio.slice(0, 10),
        });
      } catch (erro) {
        this.erro.set(
          erro instanceof Error
            ? erro.message
            : 'Não foi possível carregar a matrícula.',
        );

        this.form.disable();
      }
    }
  }

  protected invalido(
    campo: keyof typeof this.form.controls,
  ): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && controle.touched;
  }

  protected salvar(): void {
    if (this.form.disabled) {
      return;
    }

    this.erro.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const entrada = this.form.getRawValue();

    try {
      if (this.id) {
        this.service.atualizar(this.id, entrada);
      } else {
        this.service.criar(entrada);
      }
    } catch (erro) {
      this.erro.set(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível salvar a matrícula.',
      );
      return;
    }

    void this.router.navigate(['/matriculas'], {
      queryParams: {
        resultado: this.id ? 'editada' : 'cadastrada',
      },
    });
  }
}