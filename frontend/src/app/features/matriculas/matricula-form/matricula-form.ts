import { forkJoin } from 'rxjs';
import { idDe } from '../../../core/models/referencia';
import { AlunosService } from '../../alunos/services/alunos.service';
import { PlanosService } from '../../planos/services/planos.service';
import { InstrutoresService } from '../../instrutores/services/instrutores.service';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatriculaEntrada } from '../matricula.model';
import { MatriculasService } from '../services/matriculas.service';

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
    aluno: ['', Validators.required],
    plano: ['', Validators.required],
    instrutor: ['', Validators.required],
    dataInicio: ['', Validators.required],
  });
  protected readonly erro = signal<string | null>(null);
  protected readonly salvando = signal(false);

  private readonly alunosService = inject(AlunosService);
  private readonly planosService = inject(PlanosService);
  private readonly instrutoresService = inject(InstrutoresService);
  protected readonly alunos = signal<{ _id: string; nome: string }[]>([]);
  protected readonly planos = signal<{ _id: string; nome: string }[]>([]);
  protected readonly instrutores = signal<{ _id: string; nome: string }[]>([]);

  ngOnInit(): void {
    forkJoin({
      alunos: this.alunosService.listar(),
      planos: this.planosService.listar(),
      instrutores: this.instrutoresService.listar(),
    }).subscribe({
      next: (listas) => {
        this.alunos.set(listas.alunos);
        this.planos.set(listas.planos);
        this.instrutores.set(listas.instrutores);
      },
      error: (e: Error) => this.erro.set(e.message),
    });
    const id = this.id();
    if (id) {
      this.form.disable();
      this.service.buscarPorId(id).subscribe({
        next: (p) => {
          this.form.patchValue({
            ...p,
            aluno: idDe(p.aluno),
            plano: idDe(p.plano),
            instrutor: idDe(p.instrutor),
            dataInicio: p.dataInicio.slice(0, 10),
          });
          this.form.enable();
        },
        error: (e: Error) => this.erro.set(e.message),
      });
    }
  }

  protected invalido(campo: keyof typeof this.form.controls): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && controle.touched;
  }

  protected salvar(): void {
    if (this.salvando() || this.form.disabled) return;
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
      next: () => this.router.navigate(['/matriculas'], { queryParams: { resultado: 'salvo' } }),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.salvando.set(false);
      },
    });
  }
}
