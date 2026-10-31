import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { textoDe } from '../../../core/models/referencia';
import {
  Matricula,
  STATUS,
  Status,
  TRANSICOES,
} from '../matricula.model';
import { MatriculasMockService } from '../services/matriculas-mock.service';

@Component({
  selector: 'app-matriculas-lista',
  imports: [DatePipe, RouterLink],
  templateUrl: './matriculas-lista.html',
})
export class MatriculasLista {
  private readonly matriculasService = inject(MatriculasMockService);

  protected readonly textoDe = textoDe;
  protected readonly opcoesStatus = STATUS;
  protected readonly transicoes = TRANSICOES;

  protected readonly sucesso = signal('');
  protected readonly erro = signal('');
  protected readonly status = signal<Status | ''>('');
  protected readonly matriculas = signal<Matricula[]>([]);
  protected readonly carregando = signal(true);

  protected readonly nomesAcoes: Record<Status, string> = {
    ativa: 'Reativar',
    trancada: 'Trancar',
    cancelada: 'Cancelar',
  };

  protected readonly matriculasFiltradas = computed(() => {
    const status = this.status();

    return this.matriculas().filter(
      (matricula) => !status || matricula.status === status,
    );
  });
  constructor() {
    const resultado = inject(ActivatedRoute)
      .snapshot.queryParamMap.get('resultado');

    if (resultado === 'cadastrada') {
      this.sucesso.set('Matrícula cadastrada com sucesso.');
    } else if (resultado === 'editada') {
      this.sucesso.set('Matrícula atualizada com sucesso.');
    }

    void this.carregar();
  }
  protected async carregar(): Promise<void> {
  this.carregando.set(true);
  this.erro.set('');

  try {
    const matriculas = await this.matriculasService.listarComEspera();
    this.matriculas.set(matriculas);
  } catch (erro) {
    this.erro.set(
      erro instanceof Error
        ? erro.message
        : 'Não foi possível carregar as matrículas.',
    );
  } finally {
    this.carregando.set(false);
  }
}
  protected filtrar(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.status.set(select.value as Status | '');
  }

  protected mudarStatus(matricula: Matricula, novo: Status): void {
    const confirmado = window.confirm(
      `Deseja mudar o status da matrícula para "${novo}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.sucesso.set('');
    this.erro.set('');

    try {
      this.matriculasService.mudarStatus(matricula._id, novo);
      this.matriculas.set(this.matriculasService.listar());
      this.sucesso.set('Status atualizado com sucesso.');
    } catch (erro) {
      this.erro.set(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível atualizar o status.',
      );
    }
  }
}