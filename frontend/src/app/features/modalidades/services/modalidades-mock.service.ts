import { Injectable } from '@angular/core';
import { defer, delay, Observable, of } from 'rxjs';
import { Modalidade, ModalidadeEntrada, Intensidade } from '../modalidade.model';
import { ModalidadesService } from './modalidades.service';

@Injectable()
export class ModalidadesMockService extends ModalidadesService {
  private itens: Modalidade[] = [
    {
      _id: '1',
      nome: 'Musculação',
      descricao: 'Treino com pesos e aparelhos',
      intensidade: 'moderada',
      capacidadeMaxima: 20,
      ativo: true,
    },
    {
      _id: '2',
      nome: 'Pilates',
      descricao: 'Mobilidade e fortalecimento',
      intensidade: 'leve',
      capacidadeMaxima: 10,
      ativo: true,
    },
    {
      _id: '3',
      nome: 'Spinning',
      descricao: 'Treino em bicicleta',
      intensidade: 'intensa',
      capacidadeMaxima: 25,
      ativo: true,
    },
  ];
  private proximoId = 4;

  listar(filtro?: Intensidade, todos = false): Observable<Modalidade[]> {
    return defer(() =>
      of(
        this.itens
          .filter((p) => (todos || p.ativo) && (!filtro || p.intensidade === filtro))
          .map((p) => ({ ...p }))
          .sort((a, b) => a.nome.localeCompare(b.nome)),
      ),
    ).pipe(delay(400));
  }
  buscarPorId(id: string): Observable<Modalidade> {
    return defer(() => of({ ...this.encontrar(id) })).pipe(delay(400));
  }
  criar(dados: ModalidadeEntrada): Observable<Modalidade> {
    return defer(() => {
      this.validar(dados);
      const novo: Modalidade = { ...dados, _id: String(this.proximoId++), ativo: true };
      this.itens.push(novo);
      return of({ ...novo });
    }).pipe(delay(400));
  }
  atualizar(id: string, dados: Partial<ModalidadeEntrada>): Observable<Modalidade> {
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
  private encontrar(id: string): Modalidade {
    const item = this.itens.find((p) => p._id === id);
    if (!item) throw new Error('Modalidade não encontrado.');
    return item;
  }
  private validar(novo: ModalidadeEntrada, id?: string): void {
    if (
      this.itens.some(
        (p) => p._id !== id && p.nome.toLocaleLowerCase() === novo.nome.toLocaleLowerCase(),
      )
    ) {
      throw new Error('Já existe um registro com este nome.');
    }
  }
}
