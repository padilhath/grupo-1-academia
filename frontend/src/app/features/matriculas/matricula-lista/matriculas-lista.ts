import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { textoDe } from '../../../core/models/referencia';
import { Matricula, STATUS, Status, TRANSICOES } from '../matricula.model';
import { MatriculasMockService } from '../services/matriculas-mock.service';
import { FormsModule } from '@angular/forms';
import { MatriculaCard } from '../matricula-card/matricula-card';

@Component({
  selector: 'app-matriculas-lista',
  imports: [DatePipe, RouterLink, MatriculaCard, FormsModule],
  templateUrl: './matriculas-lista.html',
})
export class MatriculasLista implements OnInit {
  private readonly matriculasService = inject(MatriculasMockService);

  protected readonly textoDe = textoDe;
  protected readonly status = STATUS;
  protected readonly transicoes = TRANSICOES;
  protected readonly matriculas = signal<Matricula[]>([]);
  protected readonly erro = signal('');
  protected readonly sucesso = signal('');
  protected readonly filtro = signal<Status | null>(null);
  protected readonly carregando = signal(true);
  protected readonly modo = signal<'tabela' | 'cartoes'>('tabela');

  protected readonly nomesAcoes: Record<Status, string> = {
    ativa: 'Reativar',
    trancada: 'Trancar',
    cancelada: 'Cancelar',
  };

  ngOnInit(): void {
    this.carregar();
  }

  protected filtrar(valor: Status | null): void {
    this.filtro.set(valor);
    this.carregar();
  }

  protected async carregar(): Promise<void> {
    this.carregando.set(true);
    this.erro.set('');

    this.matriculasService.listar(this.filtro() ?? undefined).subscribe({
      next: (lista) => {
        this.matriculas.set(lista);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  protected mudarStatus(matricula: Matricula, novo: Status): void {
    this.sucesso.set('');
    this.erro.set('');

    this.matriculasService.mudarStatus(matricula._id, novo).subscribe({
      next: () => {
        this.matriculasService.listar().subscribe({
          next: (lista) => {
            this.matriculas.set(lista);
          },
        });
      },
      error: (erro) => {
        this.erro.set(
          erro instanceof Error ? erro.message : 'Não foi possível atualizar o filtro.',
        );
      },
    });
  }
}
