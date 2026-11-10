import { Injectable } from '@angular/core';
import { defer, delay, Observable, of } from 'rxjs';
import { Instrutor, InstrutorEntrada, Turno } from '../instrutor.model';
import { InstrutoresService } from './instrutores.service';

@Injectable()
export class InstrutoresMockService extends InstrutoresService {
  private itens: Instrutor[] = [
    {
      _id: '1',
      nome: 'João Personal',
      email: 'joao.personal@academia.com',
      telefone: '(51) 99876-5432',
      cref: '012345-G/RS',
      turno: 'noite',
      ativo: true,
    },
    {
      _id: '2',
      nome: 'Ana Ribeiro',
      email: 'ana@academia.com',
      telefone: '(51) 99123-4567',
      cref: '023456-G/RS',
      turno: 'manha',
      ativo: true,
    },
    {
      _id: '3',
      nome: 'Carlos Lima',
      email: 'carlos@academia.com',
      telefone: '(51) 99456-7890',
      cref: '034567-G/RS',
      turno: 'tarde',
      ativo: true,
    },
  ];
  private proximoId = 4;

  listar(filtro?: Turno, todos = false): Observable<Instrutor[]> {
    return defer(() =>
      of(
        this.itens
          .filter((p) => (todos || p.ativo) && (!filtro || p.turno === filtro))
          .map((p) => ({ ...p }))
          .sort((a, b) => a.nome.localeCompare(b.nome)),
      ),
    ).pipe(delay(400));
  }
  buscarPorId(id: string): Observable<Instrutor> {
    return defer(() => of({ ...this.encontrar(id) })).pipe(delay(400));
  }
  criar(dados: InstrutorEntrada): Observable<Instrutor> {
    return defer(() => {
      this.validar(dados);
      const novo: Instrutor = { ...dados, _id: String(this.proximoId++), ativo: true };
      this.itens.push(novo);
      return of({ ...novo });
    }).pipe(delay(400));
  }
  atualizar(id: string, dados: Partial<InstrutorEntrada>): Observable<Instrutor> {
    return defer(() => {
      const item = this.encontrar(id);
      const novo = { ...item, ...dados };
      this.validar(novo, id);
      Object.assign(item, novo);
      return of({ ...item });
    }).pipe(delay(400));
  }
  remover(id: string): Observable<void> {
    return defer(() => {
      this.encontrar(id).ativo = false;
      return of(undefined);
    }).pipe(delay(400));
  }
  private encontrar(id: string): Instrutor {
    const item = this.itens.find((p) => p._id === id);
    if (!item) throw new Error('Instrutor não encontrado.');
    return item;
  }
  private validar(novo: InstrutorEntrada, id?: string): void {
    if (
      this.itens.some(
        (p) => p._id !== id && p.email.toLocaleLowerCase() === novo.email.toLocaleLowerCase(),
      )
    ) {
      throw new Error('Já existe um registro com este email.');
    }
    if (
      this.itens.some(
        (p) => p._id !== id && p.cref.toLocaleLowerCase() === novo.cref.toLocaleLowerCase(),
      )
    ) {
      throw new Error('Já existe um registro com este CREF.');
    }
  }
}
