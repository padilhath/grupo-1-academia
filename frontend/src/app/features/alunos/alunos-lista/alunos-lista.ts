import { AuthService } from '../../../core/auth/auth.service';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OPCOES_OBJETIVO, Objetivo, Aluno } from '../aluno.model';
import { FormsModule } from '@angular/forms';
import { AlunoCard } from '../aluno-card/aluno-card';
import { AlunosService } from '../services/alunos.service';

/** Tela de listagem (componente de página — PDF 02, cap. 4). */
@Component({
  selector: 'app-alunos-lista',
  imports: [DatePipe, RouterLink, AlunoCard, FormsModule],
  templateUrl: './alunos-lista.html',
})
export class AlunosLista implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly alunosService = inject(AlunosService);

  protected readonly objetivos = OPCOES_OBJETIVO;
  // Estado da tela com signals (PDF 02, cap. 11)
  protected readonly alunos = signal<Aluno[]>([]);
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly sucesso = signal<string | null>(null);
  protected readonly filtro = signal<Objetivo | null>(null);
  // Estado LOCAL da tela: como mostrar a lista (aula 02 — @if e componente filho)
  protected readonly modo = signal<'tabela' | 'cartoes'>('tabela');

  private readonly route = inject(ActivatedRoute);
  ngOnInit(): void {
    const resultado = this.route.snapshot.queryParamMap.get('resultado');
    if (resultado === 'salvo') this.sucesso.set('Registro salvo com sucesso.');
    this.carregar();
  }

  protected filtrar(valor: Objetivo | null): void {
    this.filtro.set(valor);
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.alunosService.listar(this.filtro() ?? undefined).subscribe({
      next: (lista) => {
        this.alunos.set(lista);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  protected excluir(aluno: Aluno): void {
    if (!confirm(`Excluir o aluno "${aluno.nome}"?`)) {
      return;
    }
    this.erro.set(null);
    this.sucesso.set(null);
    this.alunosService.remover(aluno._id).subscribe({
      next: () => {
        this.sucesso.set(`Aluno "${aluno.nome}" excluído.`);
        this.carregar();
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
