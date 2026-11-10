import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OPCOES_OBJETIVO, Objetivo, AlunoEntrada } from '../aluno.model';
import { AlunosService } from '../services/alunos.service';

/**
 * Formulário reativo de cadastro e edição (PDF 02, cap. 7).
 * As mesmas regras do DTO do back-end são validadas aqui para dar
 * feedback rápido ao usuário — mas quem garante é a API.
 */
@Component({
  selector: 'app-aluno-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './aluno-form.html',
})
export class AlunoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly alunosService = inject(AlunosService);

  /** Vem da rota :id/editar (withComponentInputBinding). Vazio = cadastro. */
  readonly id = input<string>();

  protected readonly opcoesObjetivo = OPCOES_OBJETIVO;
  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
    dataNascimento: ['', Validators.required],
    objetivo: ['' as Objetivo | '', Validators.required],
  });

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.form.disable();
      this.alunosService.buscarPorId(id).subscribe({
        next: (p) => {
          this.form.patchValue({ ...p, dataNascimento: p.dataNascimento.slice(0, 10) });
          this.form.enable();
        },
        error: (e: Error) => this.erro.set(e.message),
      });
    }
  }

  /** Mostra o erro só depois que o usuário mexeu no campo (touched). */
  protected invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  protected salvar(): void {
    if (this.salvando() || this.form.disabled) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.erro.set(null);

    const dados = this.form.getRawValue() as AlunoEntrada;
    const id = this.id();
    const operacao = id ? this.alunosService.atualizar(id, dados) : this.alunosService.criar(dados);

    operacao.subscribe({
      next: () => this.router.navigate(['/alunos'], { queryParams: { resultado: 'salvo' } }),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
}
