import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Intensidade, OPCOES_INTENSIDADE, ModalidadeEntrada } from '../modalidade.model';
import { ModalidadesService } from '../services/modalidades.service';

@Component({
  selector: 'app-modalidade-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './modalidade-form.html',
})
export class ModalidadeForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(ModalidadesService);

  readonly id = input<string>();

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    descricao: ['', Validators.maxLength(300)],
    intensidade: ['' as Intensidade | '', Validators.required],
    capacidadeMaxima: [
      1,
      [Validators.required, Validators.min(1), Validators.max(50), Validators.pattern(/^\d+$/)],
    ],
  });
  protected readonly erro = signal<string | null>(null);
  protected readonly salvando = signal(false);
  protected readonly intensidades = OPCOES_INTENSIDADE;

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.form.disable();
      this.service.buscarPorId(id).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.form.enable();
        },
        error: (e: Error) => this.erro.set(e.message),
      });
    }
  }

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

    const dados = this.form.getRawValue() as ModalidadeEntrada;
    const id = this.id();
    const operacao = id ? this.service.atualizar(id, dados) : this.service.criar(dados);

    operacao.subscribe({
      next: () => this.router.navigate(['/modalidades'], { queryParams: { resultado: 'salvo' } }),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
}
