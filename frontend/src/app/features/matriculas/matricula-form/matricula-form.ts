import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatriculaEntrada } from '../matricula.model';
import { MatriculasService } from '../services/matriculas.service';
import { Referencia } from '../../../core/models/referencia';

@Component({
  selector: 'app-matricula-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './matricula-form.html',
})
export class MatriculaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(MatriculasService);

  readonly id = input<string>();

  protected readonly form = this.fb.nonNullable.group({
    aluno: ['' as Referencia, Validators.required],
    plano: ['' as Referencia, Validators.required],
    instrutor: ['' as Referencia, Validators.required],
    dataInicio: ['', Validators.required],
  });
  protected readonly erro = signal<string | null>(null);
  protected readonly salvando = signal(false);

  protected readonly alunos = [
    { _id: '1', nome: 'Aluno de exemplo 1' },
    { _id: '2', nome: 'Aluno de exemplo 2' },
    { _id: '3', nome: 'Aluno de exemplo 3' },
  ];

  protected readonly planos = [
    { _id: '1', nome: 'Plano de exemplo 1' },
    { _id: '2', nome: 'Plano de exemplo 2' },
    { _id: '3', nome: 'Plano de exemplo 3' },
  ];

  protected readonly instrutores = [
    { _id: '1', nome: 'Instrutor de exemplo 1' },
    { _id: '2', nome: 'Instrutor de exemplo 2' },
    { _id: '3', nome: 'Instrutor de exemplo 3' },
  ];

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
    const controle = this.form.controls[campo];
    return controle.invalid && controle.touched;
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.erro.set(null);

    const dados = this.form.getRawValue() as MatriculaEntrada;
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
