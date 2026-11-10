import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global de exceções (aula 14, slides 4 a 6).
 * Captura qualquer erro lançado pela aplicação, padroniza a resposta JSON
 * e registra logs sem expor detalhes internos ao cliente.
 *
 * Registre no main.ts depois de passar nos 6 testes obrigatórios:
 * app.useGlobalFilters(new ExcecoesFilter());
 */
@Catch() // sem parâmetro = captura QUALQUER erro
export class ExcecoesFilter implements ExceptionFilter {
  private readonly logger = new Logger('Erros');

  catch(excecao: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const resposta = ctx.getResponse<Response>();
    const requisicao = ctx.getRequest<Request>();

    const status =
      excecao instanceof HttpException
        ? excecao.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // TODO 1: monte a mensagem.
    //         HttpException → use a mensagem da exceção (excecao.getResponse()).
    //         outro erro    → "Erro interno. Tente novamente mais tarde." (nunca o stack!)
    // TODO 2: status >= 500 → this.logger.error(método, url, stack)
    //         senão (4xx)   → this.logger.warn(método, url, status, mensagem)

    resposta.status(status).json({
      sucesso: false,
      status,
      message: 'TODO',
      caminho: requisicao.url,
      dataHora: new Date().toISOString(),
    });
  }
}

