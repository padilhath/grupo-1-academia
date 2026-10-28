import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { DuracaoMeses, Plano, PlanoEntrada } from '../plano.model';
import { PlanosService } from './planos.service';

/**
 * Serviço MOCK: guarda os planos em memória e simula a API,
 * inclusive o tempo de resposta e as mesmas regras de negócio.
 * Usado enquanto o back-end ainda não existe (aulas 02 a 12).
 */
@Injectable()
export class PlanosMockService extends PlanosService {
  private planos: Plano[] = [
    {
      _id: '1',
      nome: 'Musculação trimestral',
      modalidade: '1',
      valorMensal: 99.9,
      duracaoMeses: 3,
      ativo: true,
    },
  ];
  private proximoId = 5;
  private readonly atraso = 400; // ms, para enxergar o "carregando..."

  listar(duracaoMeses?: DuracaoMeses): Observable<Plano[]> {
    const lista = duracaoMeses
      ? this.planos.filter((p) => p.duracaoMeses === duracaoMeses)
      : this.planos;
    return of([...lista].sort((a, b) => a.nome.localeCompare(b.nome))).pipe(delay(this.atraso));
  }

  buscarPorId(id: string): Observable<Plano> {
    const produto = this.planos.find((p) => p._id === id);
    return produto
      ? of({ ...produto }).pipe(delay(this.atraso))
      : throwError(() => new Error(`Plano ${id} não encontrado`));
  }

  criar(dados: PlanoEntrada): Observable<Plano> {
    if (this.planos.some((p) => p.nome === dados.nome)) {
      return throwError(() => new Error(`Já existe um produto com o nome "${dados.nome}"`));
    }
    const novo: Plano = { ...dados, _id: String(this.proximoId++), ativo: dados.ativo ?? true };
    this.planos.push(novo);
    return of(novo).pipe(delay(this.atraso));
  }

  atualizar(id: string, dados: Partial<PlanoEntrada>): Observable<Plano> {
    const indice = this.planos.findIndex((p) => p._id === id);
    if (indice < 0) {
      return throwError(() => new Error(`Plano ${id} não encontrado`));
    }
    this.planos[indice] = { ...this.planos[indice], ...dados };
    return of(this.planos[indice]).pipe(delay(this.atraso));
  }

  remover(id: string): Observable<void> {
    const produto = this.planos.find((p) => p._id === id);
    /*
    if (produto && produto.estoque > 0) {
      return throwError(
        () =>
          new Error(
            'Não é possível excluir um produto com estoque. Zere o estoque ou inative o produto.',
          ),
      );
    }
    */

    this.planos = this.planos.filter((p) => p._id !== id);
    return of(undefined).pipe(delay(this.atraso));
  }
}
