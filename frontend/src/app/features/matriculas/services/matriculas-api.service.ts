import { Injectable } from '@angular/core';
import { idDe } from '../../../core/models/referencia';
import { Matricula, MatriculaEntrada, Status, TRANSICOES } from '../matricula.model';
import { MatriculasService } from './matriculas.service';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatriculasApiService extends MatriculasService {
  private proximoId = 4;
  private readonly atraso = 400;

  // TODO: integrar as referências reais após o merge.
  private matriculas: Matricula[] = [
    {
      _id: '1',
      aluno: '1',
      plano: '1',
      instrutor: '1',
      dataInicio: '2026-11-03',
      status: 'ativa',
    },
    {
      _id: '2',
      aluno: '2',
      plano: '2',
      instrutor: '1',
      dataInicio: '2026-11-04',
      status: 'trancada',
    },
    {
      _id: '3',
      aluno: '3',
      plano: '1',
      instrutor: '2',
      dataInicio: '2026-11-05',
      status: 'cancelada',
    },
  ];

  listar(status?: Status): Observable<Matricula[]> {
    return of(
      this.matriculas
        .filter((matricula) => !status || matricula.status === status)
        .map((matricula) => ({ ...matricula })),
    );
  }

  buscarPorId(id: string): Observable<Matricula> {
    return of({ ...this.encontrar(id) }).pipe(delay(this.atraso));
  }

  criar(dados: MatriculaEntrada): Observable<Matricula> {
    this.validarDataInicio(dados.dataInicio);
    this.garantirSemMatriculaAtiva(dados.aluno);
    const matricula: Matricula = {
      ...dados,
      _id: String(this.proximoId++),
      status: 'ativa',
    };

    this.matriculas.push(matricula);

    return of({ ...matricula }).pipe(delay(this.atraso));
  }

  atualizar(id: string, dados: Partial<MatriculaEntrada>): Observable<Matricula> {
    const matricula = this.encontrar(id);

    if (dados.dataInicio && dados.dataInicio !== matricula.dataInicio) {
      this.validarDataInicio(dados.dataInicio);
    }

    if (dados.aluno && matricula.status === 'ativa') {
      this.garantirSemMatriculaAtiva(dados.aluno, id);
    }

    // O status é preservado: só muda pelo método mudarStatus.
    matricula.aluno = dados.aluno ?? matricula.aluno;
    matricula.plano = dados.plano ?? matricula.plano;
    matricula.instrutor = dados.instrutor ?? matricula.instrutor;
    matricula.dataInicio = dados.dataInicio ?? matricula.dataInicio;

    return of({ ...matricula }).pipe(delay(this.atraso));
  }

  mudarStatus(id: string, novo: Status): Observable<Matricula> {
    const matricula = this.encontrar(id);

    if (!TRANSICOES[matricula.status].includes(novo)) {
      throw new Error(`Não é possível passar de "${matricula.status}" para "${novo}".`);
    }

    if (novo === 'ativa') {
      this.garantirSemMatriculaAtiva(idDe(matricula.aluno), id);
    }

    matricula.status = novo;

    return of({ ...matricula }).pipe(delay(this.atraso));
  }

  remover(id: string): Observable<void> {
    this.matriculas = this.matriculas.filter((m) => m._id !== id);
    return of(undefined).pipe(delay(this.atraso));
  }

  private encontrar(id: string): Matricula {
    const matricula = this.matriculas.find((matricula) => matricula._id === id);

    if (!matricula) {
      throw new Error('Matrícula não encontrada.');
    }

    return matricula;
  }

  private garantirSemMatriculaAtiva(aluno: string, ignorarId?: string): void {
    const existe = this.matriculas.some(
      (matricula) =>
        idDe(matricula.aluno) === aluno &&
        matricula.status === 'ativa' &&
        matricula._id !== ignorarId,
    );

    if (existe) {
      throw new Error('O aluno já possui uma matrícula ativa.');
    }
  }

  private validarDataInicio(valor: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      throw new Error('Informe uma data de início válida.');
    }

    const [ano, mes, dia] = valor.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);

    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
      throw new Error('Informe uma data de início válida.');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (data < hoje) {
      throw new Error('A data de início não pode estar no passado.');
    }
  }
}
