import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Aluno, Objetivo, OPCOES_OBJETIVO } from '../aluno.model';
import { AlunosMockService } from '../services/aluno-mock.service';

@Component({
  selector: 'app-alunos-lista',
  imports: [DatePipe, RouterLink],
  templateUrl: './alunos-lista.html',
  styleUrl: './alunos-lista.css',
})
export class AlunosLista {
  protected readonly opcoesObjetivo = OPCOES_OBJETIVO;
  private readonly alunosService = inject(AlunosMockService);

  protected readonly alunos = signal<Aluno[]>([]);
  protected readonly carregando = signal(true);
  protected readonly objetivo = signal<Objetivo | ''>('');

  protected readonly alunosFiltrados = computed(() => {
    const objetivo = this.objetivo();

    return this.alunos().filter(
      (aluno) =>
        aluno.ativo && (!objetivo || aluno.objetivo === objetivo),
    );
  });

  constructor() {
    const resultado = inject(ActivatedRoute)
      .snapshot.queryParamMap.get('resultado');

    if (resultado === 'cadastrado') {
      this.sucesso.set('Aluno cadastrado com sucesso.');
    } else if (resultado === 'editado') {
      this.sucesso.set('Aluno atualizado com sucesso.');
    }

    void this.carregar();
  }

  protected async carregar(): Promise<void> {
    this.carregando.set(true);
    this.erro.set('');

    try {
      const alunos = await this.alunosService.listarComEspera();
      this.alunos.set(alunos);
    } catch (erro) {
      this.erro.set(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar os alunos.',
      );
    } finally {
      this.carregando.set(false);
    }
  }

  protected filtrar(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.objetivo.set(select.value as Objetivo | '');
  }

  protected readonly sucesso = signal('');
  protected readonly erro = signal('');

  protected inativar(aluno: Aluno): void {
    const confirmado = window.confirm(
      `Deseja inativar o aluno ${aluno.nome}?`,
    );

    if (!confirmado) {
      return;
    }

    this.sucesso.set('');
    this.erro.set('');

    try {
      this.alunosService.remover(aluno._id);
      this.alunos.set(this.alunosService.listar());
      this.sucesso.set('Aluno inativado com sucesso.');
    } catch (erro) {
      this.erro.set(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível inativar o aluno.',
      );
    }
  }
}
