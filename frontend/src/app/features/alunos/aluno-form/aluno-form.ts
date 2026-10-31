import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AlunoEntrada,
  Objetivo,
  OPCOES_OBJETIVO,
} from '../aluno.model';
import { AlunosMockService } from '../services/aluno-mock.service';

@Component({
  selector: 'app-aluno-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './aluno-form.html',
  styleUrl: './aluno-form.css',
})
export class AlunoForm {
  private readonly fb = inject(FormBuilder);
  private readonly alunosService = inject(AlunosMockService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly opcoesObjetivo = OPCOES_OBJETIVO;
  protected readonly erro = signal('');

  protected readonly form = this.fb.nonNullable.group({
    nome: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    telefone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/),
      ],
    ],
    dataNascimento: ['', Validators.required],
    objetivo: ['' as Objetivo | '', Validators.required],
  });

  constructor() {
    if (this.id) {
      try {
        const aluno = this.alunosService.buscarPorId(this.id);

        this.form.patchValue({
          nome: aluno.nome,
          email: aluno.email,
          telefone: aluno.telefone,
          dataNascimento: aluno.dataNascimento.slice(0, 10),
          objetivo: aluno.objetivo,
        });
      } catch (erro) {
        this.erro.set(
          erro instanceof Error
            ? erro.message
            : 'Não foi possível carregar o aluno.',
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

    const valores = this.form.getRawValue();

    if (valores.objetivo === '') {
      return;
    }

    const entrada: AlunoEntrada = {
      ...valores,
      objetivo: valores.objetivo,
    };

    try {
      if (this.id) {
        this.alunosService.atualizar(this.id, entrada);
      } else {
        this.alunosService.criar(entrada);
      }
    } catch (erro) {
      this.erro.set(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível salvar o aluno.',
      );
      return;
    }

    void this.router.navigate(['/alunos'], {
      queryParams: {
        resultado: this.id ? 'editado' : 'cadastrado',
      },
    });
  }
}