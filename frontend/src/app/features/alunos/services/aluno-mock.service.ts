import { defer, delay, Observable, of } from 'rxjs';
import { AlunosService } from './alunos.service';
import { Injectable } from '@angular/core';
import { Aluno, AlunoEntrada, Objetivo } from '../aluno.model';

@Injectable({
  providedIn: 'root',
})
export class AlunosMockService extends AlunosService {
  private proximoId = 4;

  private alunos: Aluno[] = [
    {
      _id: '1',
      nome: 'Maria Souza',
      email: 'maria.souza@email.com',
      telefone: '(51) 99876-5432',
      dataNascimento: '2004-08-10',
      objetivo: 'condicionamento',
      ativo: true,
    },
    {
      _id: '2',
      nome: 'João Lima',
      email: 'joao.lima@email.com',
      telefone: '(51) 99123-4567',
      dataNascimento: '2000-03-15',
      objetivo: 'hipertrofia',
      ativo: true,
    },
    {
      _id: '3',
      nome: 'Ana Costa',
      email: 'ana.costa@email.com',
      telefone: '(51) 99456-7890',
      dataNascimento: '1995-12-20',
      objetivo: 'emagrecimento',
      ativo: true,
    },
  ];

  listar(objetivo?: Objetivo, todos = false): Observable<Aluno[]> {
    return defer(() =>
      of(
        this.alunos
          .filter((a) => (todos || a.ativo) && (!objetivo || a.objetivo === objetivo))
          .map((a) => ({ ...a }))
          .sort((a, b) => a.nome.localeCompare(b.nome)),
      ),
    ).pipe(delay(400));
  }
  buscarPorId(id: string): Observable<Aluno> {
    return defer(() => of({ ...this.encontrar(id) })).pipe(delay(400));
  }
  criar(entrada: AlunoEntrada): Observable<Aluno> {
    return defer(() => {
      this.validar(entrada);
      const aluno: Aluno = { ...entrada, _id: String(this.proximoId++), ativo: true };
      this.alunos.push(aluno);
      return of({ ...aluno });
    }).pipe(delay(400));
  }
  atualizar(id: string, entrada: Partial<AlunoEntrada>): Observable<Aluno> {
    return defer(() => {
      const aluno = this.encontrar(id);
      const novo = { ...aluno, ...entrada };
      this.validar(novo, id);
      Object.assign(aluno, novo);
      return of({ ...aluno });
    }).pipe(delay(400));
  }
  remover(id: string): Observable<void> {
    return defer(() => {
      this.encontrar(id).ativo = false;
      return of(undefined);
    }).pipe(delay(400));
  }
  private encontrar(id: string): Aluno {
    const aluno = this.alunos.find((a) => a._id === id);
    if (!aluno) throw new Error('Aluno não encontrado.');
    return aluno;
  }
  private validar(entrada: AlunoEntrada, id?: string): void {
    if (
      this.alunos.some((a) => a._id !== id && a.email.toLowerCase() === entrada.email.toLowerCase())
    ) {
      throw new Error('Já existe um aluno com este e-mail.');
    }
    const nascimento = new Date(entrada.dataNascimento + 'T00:00:00');
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    if (
      hoje.getMonth() < nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())
    )
      idade--;
    if (Number.isNaN(nascimento.getTime()) || idade < 14)
      throw new Error('A idade mínima para matrícula é 14 anos.');
  }
}
