import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { idDe } from '../../../core/models/referencia';
import { AlunosService } from '../../alunos/services/alunos.service';
import { OPCOES_OBJETIVO } from '../../alunos/aluno.model';
import { MatriculasService } from '../../matriculas/services/matriculas.service';
import { PlanosService } from '../../planos/services/planos.service';
import { Painel } from '../relatorio.model';
import { RelatoriosService } from './relatorios.service';

@Injectable()
export class RelatoriosMockService extends RelatoriosService {
  private readonly alunos = inject(AlunosService);
  private readonly matriculas = inject(MatriculasService);
  private readonly planos = inject(PlanosService);

  carregar(): Observable<Painel> {
    return forkJoin({
      alunos: this.alunos.listar(),
      matriculas: this.matriculas.listar(),
      planos: this.planos.listar(undefined, true),
    }).pipe(
      map(({ alunos, matriculas, planos }) => ({
        resumo: {
          alunos: alunos.length,
          matriculasAtivas: matriculas.filter((m) => m.status === 'ativa').length,
          matriculasTrancadas: matriculas.filter((m) => m.status === 'trancada').length,
        },
        receitaPorPlano: planos
          .map((p) => {
            const quantidade = matriculas.filter(
              (m) => m.status === 'ativa' && idDe(m.plano) === p._id,
            ).length;
            return {
              plano: p.nome,
              matriculas: quantidade,
              receitaMensal: quantidade * p.valorMensal,
            };
          })
          .filter((p) => p.matriculas > 0)
          .sort((a, b) => b.receitaMensal - a.receitaMensal),
        alunosPorObjetivo: OPCOES_OBJETIVO.map((objetivo) => ({
          _id: objetivo,
          quantidade: alunos.filter((a) => a.objetivo === objetivo).length,
        })).filter((grupo) => grupo.quantidade > 0),
      })),
    );
  }
}
