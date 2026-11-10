import { ModalidadesService } from '../../modalidades/services/modalidades.service';
import { idDe } from '../../../core/models/referencia';
import { inject, Injectable } from '@angular/core';
import { defer, delay, Observable, of, map } from 'rxjs';
import { Plano, PlanoEntrada, DuracaoMeses } from '../plano.model';
import { PlanosService } from './planos.service';

@Injectable()
export class PlanosMockService extends PlanosService {
  private readonly modalidades = inject(ModalidadesService);
  private itens: Plano[] = [
    {
      _id: '1',
      nome: 'Musculação trimestral',
      modalidade: '1',
      valorMensal: 99.9,
      duracaoMeses: 3,
      ativo: true,
    },
    {
      _id: '2',
      nome: 'Pilates semestral',
      modalidade: '2',
      valorMensal: 180,
      duracaoMeses: 6,
      ativo: true,
    },
    {
      _id: '3',
      nome: 'Spinning mensal',
      modalidade: '3',
      valorMensal: 120,
      duracaoMeses: 1,
      ativo: true,
    },
  ];
  private proximoId = 4;

  listar(filtro?: DuracaoMeses, todos = false): Observable<Plano[]> {
    return this.modalidades.listar(undefined, true).pipe(
      map((modalidades) =>
        this.itens
          .filter((p) => (todos || p.ativo) && (!filtro || p.duracaoMeses === filtro))
          .map((p) => ({
            ...p,
            modalidade: (() => {
              const m = modalidades.find((m) => m._id === idDe(p.modalidade));
              return m ? { _id: m._id, nome: m.nome } : p.modalidade;
            })(),
          }))
          .sort((a, b) => a.nome.localeCompare(b.nome)),
      ),
    );
  }
  buscarPorId(id: string): Observable<Plano> {
    return defer(() => of({ ...this.encontrar(id) })).pipe(delay(400));
  }
  criar(dados: PlanoEntrada): Observable<Plano> {
    return defer(() => {
      this.validar(dados);
      const novo: Plano = { ...dados, _id: String(this.proximoId++), ativo: true };
      this.itens.push(novo);
      return of({ ...novo });
    }).pipe(delay(400));
  }
  atualizar(id: string, dados: Partial<PlanoEntrada>): Observable<Plano> {
    return defer(() => {
      const item = this.encontrar(id);
      const novo = { ...item, ...dados };
      this.validar({ ...novo, modalidade: idDe(novo.modalidade) }, id);
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
  private encontrar(id: string): Plano {
    const item = this.itens.find((p) => p._id === id);
    if (!item) throw new Error('Plano não encontrado.');
    return item;
  }
  private validar(novo: PlanoEntrada, id?: string): void {
    if (
      this.itens.some(
        (p) => p._id !== id && p.nome.toLocaleLowerCase() === novo.nome.toLocaleLowerCase(),
      )
    ) {
      throw new Error('Já existe um registro com este nome.');
    }
  }
}
