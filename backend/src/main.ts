import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configurarAplicacao } from './configurar-aplicacao';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configurarAplicacao(app);
  app.enableShutdownHooks();
  const config = new DocumentBuilder()
    .setTitle('Turma da Bomba — API da Academia')
    .setDescription(
      'Cadastros, matrículas, relatórios e autenticação da academia.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config),
  );
  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  Logger.log(
    `API: http://localhost:${porta}/api/v1 | Swagger: http://localhost:${porta}/api/docs`,
    'Bootstrap',
  );
}
void bootstrap();
