import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DuracaoMeses, OPCOES_DURACAO_MESES, PlanoEntrada } from '../plano.model';
import { PlanosService } from '../services/planos.service';
import { Referencia } from '../../../core/models/referencia';

@Component({
  selector: 'app-plano-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './plano-form.html',
})
export class PlanoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(PlanosService);

  readonly id = input<string>();

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    modalidade: ['' as Referencia, [Validators.required]],
    valorMensal: [1, [Validators.required, Validators.min(1)]],
    duracaoMeses: [null as DuracaoMeses | null, [Validators.required]],
  });
  protected readonly erro = signal<string | null>(null);
  protected readonly salvando = signal(false);
  protected readonly duracaoMeses = OPCOES_DURACAO_MESES;

  protected readonly modalidades = signal([
    { _id: '1', nome: 'Modalidade 1' },
    { _id: '2', nome: 'Modalidade 2' },
    { _id: '3', nome: 'Modalidade 3' },
  ]);

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.service.buscarPorId(id).subscribe({
        next: (p) => this.form.patchValue(p),
        error: (e: Error) => this.erro.set(e.message),
      });
    }
  }

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
    const operacao = id ? this.service.atualizar(id, dados) : this.service.criar(dados);

    operacao.subscribe({
      next: () => this.router.navigate(['/planos']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
}
