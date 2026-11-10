import { AuthService } from '../../../core/auth/auth.service';
import { Etiqueta } from '../../../shared/etiqueta/etiqueta';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModalidadeCard } from '../modalidade-card/modalidade-card';
import { OPCOES_INTENSIDADE, Intensidade, Modalidade } from '../modalidade.model';
import { ModalidadesService } from '../services/modalidades.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modalidades-lista',
  imports: [Etiqueta, RouterLink, ModalidadeCard, FormsModule],
  templateUrl: './modalidades-lista.html',
})
export class ModalidadesLista implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly modalidadesService = inject(ModalidadesService);

  protected readonly intensidade = OPCOES_INTENSIDADE;
  protected readonly modalidades = signal<Modalidade[]>([]);
  protected readonly erro = signal<string | null>(null);
  protected readonly sucesso = signal<string | null>(null);
  protected readonly filtro = signal<Intensidade | null>(null);
  protected readonly carregando = signal(false);
  protected readonly modo = signal<'tabela' | 'cartoes'>('tabela');

  private readonly route = inject(ActivatedRoute);
  ngOnInit(): void {
    const resultado = this.route.snapshot.queryParamMap.get('resultado');
    if (resultado === 'salvo') this.sucesso.set('Registro salvo com sucesso.');
    this.carregar();
  }

  protected filtrar(valor: Intensidade | null): void {
    this.filtro.set(valor);
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.modalidadesService.listar(this.filtro() ?? undefined).subscribe({
      next: (lista) => {
        this.modalidades.set(lista);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  protected excluir(modalidade: Modalidade): void {
    if (!confirm(`Excluir a modalidade "${modalidade.nome}"?`)) {
      return;
    }
    this.erro.set(null);
    this.sucesso.set(null);
    this.modalidadesService.remover(modalidade._id).subscribe({
      next: () => {
        this.sucesso.set(`Modalidade "${modalidade.nome}" excluída.`);
        this.carregar();
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
