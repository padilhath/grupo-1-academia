import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuariosService,
    private readonly jwt: JwtService,
  ) {}
  async login(email: string, senha: string) {
    const usuario = await this.usuarios.buscarPorEmailComSenha(email);
    if (
      !usuario ||
      usuario.ativo === false ||
      !(await bcrypt.compare(senha, usuario.senhaHash))
    )
      throw new UnauthorizedException('Credenciais inválidas');
    const dados = {
      sub: String(usuario._id),
      nome: usuario.nome,
      perfil: usuario.perfil,
    };
    const accessToken = await this.jwt.signAsync(dados);
    return {
      accessToken,
      usuario: {
        _id: String(usuario._id),
        nome: usuario.nome,
        perfil: usuario.perfil,
      },
    };
  }
}
