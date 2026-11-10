import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError, mongo } from 'mongoose';
@Catch()
export class ExcecoesFilter implements ExceptionFilter {
  private readonly logger = new Logger('Erros');
  catch(excecao: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const resposta = ctx.getResponse<Response>();
    const requisicao = ctx.getRequest<Request>();
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      'Erro interno. Tente novamente mais tarde.';
    if (excecao instanceof HttpException) {
      status = excecao.getStatus();
      const corpo = excecao.getResponse();
      if (status < 500) {
        message =
          typeof corpo === 'string'
            ? corpo
            : ((corpo as { message?: string | string[] }).message ??
              excecao.message);
      }
    } else if (
      excecao instanceof mongo.MongoServerError &&
      excecao.code === 11000
    ) {
      status = HttpStatus.CONFLICT;
      message =
        'Já existe um registro com estes dados únicos. Verifique e-mail, nome, CREF ou matrícula ativa.';
    } else if (excecao instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = Object.values(excecao.errors).map((erro) => erro.message);
    } else if (excecao instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Identificador ou valor inválido';
    }
    const contexto = `${requisicao.method} ${requisicao.url} → ${status}`;
    if (status >= 500)
      this.logger.error(
        contexto,
        excecao instanceof Error ? excecao.stack : 'Erro não identificado',
      );
    else
      this.logger.warn(
        `${contexto} ${Array.isArray(message) ? message.join(' · ') : message}`,
      );
    resposta.status(status).json({
      sucesso: false,
      status,
      message,
      caminho: requisicao.url,
      dataHora: new Date().toISOString(),
    });
  }
}
