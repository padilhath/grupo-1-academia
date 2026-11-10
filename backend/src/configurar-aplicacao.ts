import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ExcecoesFilter } from './common/filters/excecoes.filter';
import { RespostaInterceptor } from './common/interceptors/resposta.interceptor';
export function configurarAplicacao(app: INestApplication): void {
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new RespostaInterceptor());
  app.useGlobalFilters(new ExcecoesFilter());
}
