import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { ROTA_PUBLICA } from '../decorators/publico.decorator';
import { PERFIS } from '../decorators/perfis.decorator';
import type { RequisicaoAutenticada, UsuarioLogado } from '../usuario-logado';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
    private readonly usuarios: UsuariosService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(ROTA_PUBLICA, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;
    const req = context.switchToHttp().getRequest<RequisicaoAutenticada>();
    const header = req.headers.authorization;
    if (!header) throw new UnauthorizedException('Token não informado');
    const partes = header.split(' ');
    if (partes.length !== 2 || partes[0] !== 'Bearer' || !partes[1])
      throw new UnauthorizedException('Token malformado');
    try {
      const payload = await this.jwt.verifyAsync<UsuarioLogado>(partes[1], {
        algorithms: ['HS256'],
      });
      if (!payload.sub || !PERFIS.includes(payload.perfil))
        throw new Error('Payload inválido');
      const usuario = await this.usuarios.buscarPorId(payload.sub);
      if (!usuario.ativo) throw new Error('Usuário inativo');
      req.usuario = {
        sub: String(usuario._id),
        nome: usuario.nome,
        perfil: usuario.perfil,
      };
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return true;
  }
}
