import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DuracaoMeses, OPCOES_DURACAO_MESES, PlanoEntrada } from '../plano.model';
import { PlanosService } from '../services/planos.service';

/**
 * Formulário reativo de cadastro e edição (PDF 02, cap. 7).
 * As mesmas regras do DTO do back-end são validadas aqui para dar
 * feedback rápido ao usuário — mas quem garante é a API.
 */
@Component({
  selector: 'app-plano-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './plano-form.html',
})
export class PlanoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly planosService = inject(PlanosService);

  /** Vem da rota :id/editar (withComponentInputBinding). Vazio = cadastro. */
  readonly id = input<string>();

  protected readonly duracaoMeses = OPCOES_DURACAO_MESES;
  protected readonly salvando = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    modalidade: ['', [Validators.required]],
    valorMensal: [1, [Validators.required, Validators.min(1)]],
    duracaoMeses: [null as DuracaoMeses | null, [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.planosService.buscarPorId(id).subscribe({
        next: (p) =>
          this.form.patchValue({
            ...p,
            modalidade: typeof p.modalidade === 'string' ? p.modalidade : p.modalidade._id,
          }),
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.erro.set(null);

    const dados = this.form.getRawValue() as PlanoEntrada;
    const id = this.id();
    const operacao = id ? this.planosService.atualizar(id, dados) : this.planosService.criar(dados);

    operacao.subscribe({
      next: () => this.router.navigate(['/planos']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
}
