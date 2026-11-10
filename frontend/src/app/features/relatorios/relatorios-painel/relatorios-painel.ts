import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Painel } from '../relatorio.model';
import { RelatoriosService } from '../services/relatorios.service';
import { ResumoCard } from '../resumo-card/resumo-card';
@Component({
  selector: 'app-relatorios-painel',
  imports: [CurrencyPipe, ResumoCard],
  templateUrl: './relatorios-painel.html',
})
export class RelatoriosPainel implements OnInit {
  readonly compacto = input(false);
  private readonly service = inject(RelatoriosService);
  protected readonly dados = signal<Painel | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  ngOnInit(): void {
    this.carregar();
  }
  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.service.carregar().subscribe({
      next: (dados) => {
        this.dados.set(dados);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
}
