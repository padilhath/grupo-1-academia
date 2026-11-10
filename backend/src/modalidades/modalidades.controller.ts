import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { ModalidadesService } from './modalidades.service';
import { CreateModalidadeDto } from './dto/create-modalidade.dto';
import { UpdateModalidadeDto } from './dto/update-modalidade.dto';
import {
  OPCOES_INTENSIDADE,
  type Intensidade,
} from './schemas/modalidade.schema';

@ApiTags('modalidades')
@ApiBearerAuth()
@ApiResponse({ status: 400, description: 'Entrada inválida' })
@ApiResponse({ status: 401, description: 'Autenticação necessária' })
@ApiResponse({ status: 403, description: 'Perfil sem permissão' })
@ApiResponse({ status: 404, description: 'Registro não encontrado' })
@ApiResponse({ status: 409, description: 'Registro duplicado' })
@Controller('modalidades')
export class ModalidadesController {
  constructor(private readonly service: ModalidadesService) {}
  @Get()
  @ApiOperation({ summary: 'Listar modalidades' })
  @ApiQuery({ name: 'intensidade', required: false, enum: OPCOES_INTENSIDADE })
  @ApiQuery({ name: 'todos', required: false, type: Boolean })
  listar(
    @Query('intensidade') filtro?: string,
    @Query('todos') todos?: string,
  ) {
    if (
      filtro !== undefined &&
      !(OPCOES_INTENSIDADE as readonly unknown[]).includes(filtro)
    )
      throw new BadRequestException('Filtro inválido');
    if (todos !== undefined && !['true', 'false'].includes(todos))
      throw new BadRequestException('Todos deve ser true ou false');
    return this.service.listar(
      filtro === undefined ? undefined : (filtro as Intensidade),
      todos === 'true',
    );
  }
  @Get(':id')
  @ApiOperation({ summary: 'Buscar modalidade pelo ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }
  @Post()
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Cadastrar modalidade' })
  @ApiResponse({ status: 201, description: 'Registro criado' })
  criar(@Body() dto: CreateModalidadeDto) {
    return this.service.criar(dto);
  }
  @Patch(':id')
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Editar modalidade' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateModalidadeDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id')
  @Perfis('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar modalidade' })
  @ApiResponse({ status: 204, description: 'Registro inativado, sem corpo' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
