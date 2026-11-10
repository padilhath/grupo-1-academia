import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { JwtAuthGuard } from './jwt-auth.guard';
describe('JwtAuthGuard', () => {
  const jwt = { verifyAsync: jest.fn() };
  const reflector = { getAllAndOverride: jest.fn() };
  const usuarios = { buscarPorId: jest.fn() };
  let guard: JwtAuthGuard;
  const contexto = (authorization?: string) => {
    const req: { headers: { authorization?: string }; usuario?: unknown } = {
      headers: { authorization },
    };
    const ctx = {
      getHandler: () => () => undefined,
      getClass: () => class {},
      switchToHttp: () => ({ getRequest: () => req }),
    } as unknown as ExecutionContext;
    return { ctx, req };
  };
  beforeEach(() => {
    jest.resetAllMocks();
    jwt.verifyAsync.mockResolvedValue({
      sub: 'id',
      nome: 'Admin antigo',
      perfil: 'admin',
    });
    usuarios.buscarPorId.mockResolvedValue({
      _id: 'id',
      nome: 'Consulta atual',
      perfil: 'consulta',
      ativo: true,
    });
    guard = new JwtAuthGuard(
      jwt as unknown as JwtService,
      reflector as unknown as Reflector,
      usuarios as unknown as UsuariosService,
    );
  });
  it('libera rotas públicas sem token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    await expect(guard.canActivate(contexto().ctx)).resolves.toBe(true);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });
  it('recusa token ausente e cabeçalho malformado', async () => {
    for (const header of [undefined, 'Basic xyz', 'Bearer x extra'])
      await expect(
        guard.canActivate(contexto(header).ctx),
      ).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('recusa token inválido ou expirado', async () => {
    jwt.verifyAsync.mockRejectedValue(new Error('expirado'));
    await expect(
      guard.canActivate(contexto('Bearer x').ctx),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('recusa usuário desativado mesmo com JWT válido', async () => {
    usuarios.buscarPorId.mockResolvedValue({ ativo: false });
    await expect(
      guard.canActivate(contexto('Bearer x').ctx),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('usa o perfil atual do banco, impedindo privilégios antigos do token', async () => {
    const { ctx, req } = contexto('Bearer x');
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(req.usuario).toEqual({
      sub: 'id',
      nome: 'Consulta atual',
      perfil: 'consulta',
    });
  });
});
