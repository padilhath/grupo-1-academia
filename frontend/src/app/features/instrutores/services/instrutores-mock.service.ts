import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Turno, Instrutor, InstrutorEntrada } from '../instrutor.model';
import { InstrutoresService } from './instrutores.service';

/**
 * Serviço MOCK: guarda os instrutores em memória e simula a API,
 * inclusive o tempo de resposta e as mesmas regras de negócio.
 * Usado enquanto o back-end ainda não existe (aulas 02 a 12).
 */
@Injectable()
export class InstrutoresMockService extends InstrutoresService {
  private instrutores: Instrutor[] = [
    {
      _id: '1',
      nome: 'Maria Souza',
      email: 'joao.personal@academia.com',
      telefone: '(51) 99876-5432',
      cref: '012345-G/RS',
      turno: 'noite',
      ativo: true,
    },
  ];
  private proximoId = 5;
  private readonly atraso = 400; // ms, para enxergar o "carregando..."

  listar(turno?: Turno): Observable<Instrutor[]> {
    const lista = turno ? this.instrutores.filter((p) => p.turno === turno) : this.instrutores;
    return of([...lista].sort((a, b) => a.nome.localeCompare(b.nome))).pipe(delay(this.atraso));
  }

  buscarPorId(id: string): Observable<Instrutor> {
    const produto = this.instrutores.find((p) => p._id === id);
    return produto
      ? of({ ...produto }).pipe(delay(this.atraso))
      : throwError(() => new Error(`Instrutor ${id} não encontrado`));
  }

  criar(dados: InstrutorEntrada): Observable<Instrutor> {
    if (this.instrutores.some((p) => p.nome === dados.nome)) {
      return throwError(() => new Error(`Já existe um produto com o nome "${dados.nome}"`));
    }
    const novo: Instrutor = { ...dados, _id: String(this.proximoId++), ativo: dados.ativo ?? true };
    this.instrutores.push(novo);
    return of(novo).pipe(delay(this.atraso));
  }

  atualizar(id: string, dados: Partial<InstrutorEntrada>): Observable<Instrutor> {
    const indice = this.instrutores.findIndex((p) => p._id === id);
    if (indice < 0) {
      return throwError(() => new Error(`Instrutor ${id} não encontrado`));
    }
    this.instrutores[indice] = { ...this.instrutores[indice], ...dados };
    return of(this.instrutores[indice]).pipe(delay(this.atraso));
  }

  remover(id: string): Observable<void> {
    const produto = this.instrutores.find((p) => p._id === id);
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

    this.instrutores = this.instrutores.filter((p) => p._id !== id);
    return of(undefined).pipe(delay(this.atraso));
  }
}
