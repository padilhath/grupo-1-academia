import { Observable } from 'rxjs';
import { Painel } from '../relatorio.model';
export abstract class RelatoriosService {
  abstract carregar(): Observable<Painel>;
}
