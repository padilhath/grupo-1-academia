import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces';
import { ExcecoesFilter } from './excecoes.filter';

describe('ExcecoesFilter (testes que precisam passar na aula 14)', () => {
  let filter: ExcecoesFilter;
  let responseMock: { status: jest.Mock; json: jest.Mock };
  let requestMock: { method: string; url: string };
  let hostMock: ArgumentsHost;

  beforeEach(() => {
    filter = new ExcecoesFilter();
    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    requestMock = {
      method: 'GET',
      url: '/api/v1/produtos/6720f1a2e611',
    };
    hostMock = {
      switchToHttp: () => ({
        getResponse: () => responseMock,
        getRequest: () => requestMock,
      }),
    } as unknown as ArgumentsHost;
  });

  it('formata HttpException prevista (404) no padrão { sucesso: false, status, message, caminho, dataHora }', () => {
    const erro = new NotFoundException('Produto não encontrado');
    filter.catch(erro, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(404);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        sucesso: false,
        status: 404,
        message: 'Produto não encontrado',
        caminho: '/api/v1/produtos/6720f1a2e611',
        dataHora: expect.any(String),
      }),
    );
  });

  it('preserva array de mensagens quando BadRequestException vem do ValidationPipe (400)', () => {
    const mensagens = [
      'O nome deve ter entre 3 e 80 caracteres',
      'O preço não pode ser negativo',
    ];
    const erro = new BadRequestException({ message: mensagens });
    filter.catch(erro, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(400);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        sucesso: false,
        status: 400,
        message: mensagens,
      }),
    );
  });

  it('responde com status 500 e mensagem genérica para erros inesperados sem expor stack', () => {
    const erro = new Error('Falha de conexão com o MongoDB');
    filter.catch(erro, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        sucesso: false,
        status: 500,
        message: 'Erro interno. Tente novamente mais tarde.',
      }),
    );
  });

  it('preenche o campo caminho com a url da requisição', () => {
    requestMock.url = '/api/v1/pedidos/10';
    const erro = new NotFoundException('Pedido não encontrado');
    filter.catch(erro, hostMock);

    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        caminho: '/api/v1/pedidos/10',
      }),
    );
  });

  it('registra warn no logger com método, rota e status para erros de cliente (4xx)', () => {
    const warnSpy = jest
      .spyOn((filter as unknown as { logger: { warn: () => void } }).logger, 'warn')
      .mockImplementation();
    const erro = new NotFoundException('Produto não encontrado');
    filter.catch(erro, hostMock);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/v1/produtos/6720f1a2e611 → 404'),
    );
  });

  it('registra error no logger com stack para erros internos do servidor (500)', () => {
    const errorSpy = jest
      .spyOn((filter as unknown as { logger: { error: () => void } }).logger, 'error')
      .mockImplementation();
    const erro = new Error('Falha catastrófica');
    filter.catch(erro, hostMock);

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/v1/produtos/6720f1a2e611 → 500'),
      expect.any(String),
    );
  });
});

