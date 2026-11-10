import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuariosService } from './usuarios.service';
@ApiTags('usuarios')
@ApiBearerAuth()
@Perfis('admin')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}
  @Post()
  @ApiOperation({ summary: 'Administrador cria usuário com perfil escolhido' })
  @ApiResponse({ status: 201, description: 'Usuário criado sem hash da senha' })
  @ApiResponse({ status: 403, description: 'Apenas administradores' })
  @ApiResponse({ status: 409, description: 'E-mail duplicado' })
  criar(@Body() dto: CreateUsuarioDto) {
    return this.service.criar(dto);
  }
}
