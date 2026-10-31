import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlanoCard } from '../plano-card/plano-card';
import { OPCOES_DURACAO_MESES, DuracaoMeses, Plano } from '../plano.model';
import { PlanosService } from '../services/planos.service';
import { FormsModule } from '@angular/forms';

/** Tela de listagem (componente de página — PDF 02, cap. 4). */
@Component({
  selector: 'app-planos-lista',
  imports: [RouterLink, CurrencyPipe, PlanoCard, FormsModule],
  templateUrl: './plano-lista.html',
})
export class PlanosLista implements OnInit {
  private readonly planosService = inject(PlanosService);

  protected readonly duracaoMeses = OPCOES_DURACAO_MESES;
  // Estado da tela com signals (PDF 02, cap. 11)
  protected readonly planos = signal<Plano[]>([]);
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly sucesso = signal<string | null>(null);
  protected readonly filtro = signal<DuracaoMeses | null>(null);
  // Estado LOCAL da tela: como mostrar a lista (aula 02 — @if e componente filho)
  protected readonly modo = signal<'tabela' | 'cartoes'>('tabela');

  ngOnInit(): void {
    this.carregar();
  }

  protected filtrar(valor: DuracaoMeses | null): void {
    this.filtro.set(valor);
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.planosService.listar(this.filtro() ?? undefined).subscribe({
      next: (lista) => {
        this.planos.set(lista);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  protected excluir(plano: Plano): void {
    if (!confirm(`Excluir o plano "${plano.nome}"?`)) {
      return;
    }
    this.erro.set(null);
    this.sucesso.set(null);
    this.planosService.remover(plano._id).subscribe({
      next: () => {
        this.sucesso.set(`Plano "${plano.nome}" excluído.`);
        this.carregar();
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
