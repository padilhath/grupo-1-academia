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

// Formatos brasileiros para moeda, datas e números (R$ 8,90)
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    // Escolhe a implementação do serviço conforme o environment.
    // Cada aluno registra aqui o serviço do seu módulo, do mesmo jeito.
    {
      provide: PlanosService,
      useClass: environment.usarMock ? PlanosMockService : PlanosApiService,
    },
  ],
};
