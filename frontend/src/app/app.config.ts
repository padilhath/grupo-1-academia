import { RelatoriosApiService } from './features/relatorios/services/relatorios-api.service';
import { ModalidadesApiService } from './features/modalidades/services/modalidades-api.service';
import { AlunosApiService } from './features/alunos/services/alunos-api.service';
import { provideAppInitializer, inject } from '@angular/core';
import { withInterceptors } from '@angular/common/http';
import { AuthService } from './core/auth/auth.service';
import { authInterceptor } from './core/auth/auth.interceptor';
import { RelatoriosService } from './features/relatorios/services/relatorios.service';
import { RelatoriosMockService } from './features/relatorios/services/relatorios-mock.service';
import { AlunosService } from './features/alunos/services/alunos.service';
import { AlunosMockService } from './features/alunos/services/aluno-mock.service';
import { ModalidadesService } from './features/modalidades/services/modalidades.service';
import { ModalidadesMockService } from './features/modalidades/services/modalidades-mock.service';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { PlanosApiService } from './features/planos/services/planos-api.service';
import { PlanosMockService } from './features/planos/services/planos-mock.service';
import { PlanosService } from './features/planos/services/planos.service';
import { InstrutoresApiService } from './features/instrutores/services/instrutores-api.service';
import { InstrutoresMockService } from './features/instrutores/services/instrutores-mock.service';
import { InstrutoresService } from './features/instrutores/services/instrutores.service';
import { MatriculasService } from './features/matriculas/services/matriculas.service';
import { MatriculasMockService } from './features/matriculas/services/matriculas-mock.service';
import { MatriculasApiService } from './features/matriculas/services/matriculas-api.service';

// Formatos brasileiros para moeda, datas e números (R$ 8,90)
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => inject(AuthService).restaurar()),
    {
      provide: RelatoriosService,
      useClass: environment.usarMock ? RelatoriosMockService : RelatoriosApiService,
    },
    {
      provide: AlunosService,
      useClass: environment.usarMock ? AlunosMockService : AlunosApiService,
    },
    {
      provide: ModalidadesService,
      useClass: environment.usarMock ? ModalidadesMockService : ModalidadesApiService,
    },
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    // Escolhe a implementação do serviço conforme o environment.
    // Cada aluno registra aqui o serviço do seu módulo, do mesmo jeito.
    {
      provide: PlanosService,
      useClass: environment.usarMock ? PlanosMockService : PlanosApiService,
    },
    {
      provide: InstrutoresService,
      useClass: environment.usarMock ? InstrutoresMockService : InstrutoresApiService,
    },
    {
      provide: MatriculasService,
      useClass: environment.usarMock ? MatriculasMockService : MatriculasApiService,
    },
  ],
};
