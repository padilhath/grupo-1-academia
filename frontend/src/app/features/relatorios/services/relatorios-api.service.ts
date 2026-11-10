import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaApi } from '../../../core/models/resposta-api';
import { tratarErroApi } from '../../../core/http/tratar-erro-api';
import { AlunosPorObjetivo, Painel, ReceitaPorPlano, Resumo } from '../relatorio.model';
import { RelatoriosService } from './relatorios.service';
@Injectable()
export class RelatoriosApiService extends RelatoriosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/relatorios`;
  carregar(): Observable<Painel> {
    return forkJoin({
      resumo: this.http.get<RespostaApi<Resumo>>(`${this.url}/resumo`).pipe(map((r) => r.dados)),
      receitaPorPlano: this.http
        .get<RespostaApi<ReceitaPorPlano[]>>(`${this.url}/receita-por-plano`)
        .pipe(map((r) => r.dados)),
      alunosPorObjetivo: this.http
        .get<RespostaApi<AlunosPorObjetivo[]>>(`${this.url}/alunos-por-objetivo`)
        .pipe(map((r) => r.dados)),
    }).pipe(catchError(tratarErroApi));
  }
}
