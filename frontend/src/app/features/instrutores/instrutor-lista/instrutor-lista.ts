import { AuthService } from '../../../core/auth/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OPCOES_TURNO, Turno, Instrutor } from '../instrutor.model';
import { FormsModule } from '@angular/forms';
import { InstrutorCard } from '../instrutor-card/instrutor-card';
import { InstrutoresService } from '../services/instrutores.service';

/** Tela de listagem (componente de página — PDF 02, cap. 4). */
@Component({
  selector: 'app-instrutores-lista',
  imports: [RouterLink, InstrutorCard, FormsModule],
  templateUrl: './instrutor-lista.html',
})
export class InstrutoresLista implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly instrutoresService = inject(InstrutoresService);

  protected readonly turnos = OPCOES_TURNO;
  // Estado da tela com signals (PDF 02, cap. 11)
  protected readonly instrutores = signal<Instrutor[]>([]);
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly sucesso = signal<string | null>(null);
  protected readonly filtro = signal<Turno | null>(null);
  // Estado LOCAL da tela: como mostrar a lista (aula 02 — @if e componente filho)
  protected readonly modo = signal<'tabela' | 'cartoes'>('tabela');

  private readonly route = inject(ActivatedRoute);
  ngOnInit(): void {
    const resultado = this.route.snapshot.queryParamMap.get('resultado');
    if (resultado === 'salvo') this.sucesso.set('Registro salvo com sucesso.');
    this.carregar();
  }

  protected filtrar(valor: Turno | null): void {
    this.filtro.set(valor);
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.instrutoresService.listar(this.filtro() ?? undefined).subscribe({
      next: (lista) => {
        this.instrutores.set(lista);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }

  protected excluir(instrutor: Instrutor): void {
    if (!confirm(`Excluir o instrutor "${instrutor.nome}"?`)) {
      return;
    }
    this.erro.set(null);
    this.sucesso.set(null);
    this.instrutoresService.remover(instrutor._id).subscribe({
      next: () => {
        this.sucesso.set(`Instrutor "${instrutor.nome}" excluído.`);
        this.carregar();
      },
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
