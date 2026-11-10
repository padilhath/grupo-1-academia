import { Body, Controller, Get, Post, Req, HttpCode } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Publico } from './decorators/publico.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CadastroDto } from '../usuarios/dto/create-usuario.dto';
import type { RequisicaoAutenticada } from './usuario-logado';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly usuarios: UsuariosService,
  ) {}
  @Publico()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Autenticar e obter JWT válido por uma hora' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.senha);
  }
  @Publico()
  @Post('cadastro')
  @ApiOperation({ summary: 'Criar conta pública com perfil somente consulta' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  cadastrar(@Body() dto: CadastroDto) {
    return this.usuarios.criar({ ...dto, perfil: 'consulta' });
  }
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consultar identidade da sessão atual' })
  me(@Req() req: RequisicaoAutenticada) {
    return this.usuarios.buscarPorId(req.usuario.sub);
  }
}
