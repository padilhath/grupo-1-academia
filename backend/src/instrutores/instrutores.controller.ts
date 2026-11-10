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
import { InstrutoresService } from './instrutores.service';
import { CreateInstrutorDto } from './dto/create-instrutor.dto';
import { UpdateInstrutorDto } from './dto/update-instrutor.dto';
import { OPCOES_TURNO, type Turno } from './schemas/instrutor.schema';

@ApiTags('instrutores')
@ApiBearerAuth()
@ApiResponse({ status: 400, description: 'Entrada inválida' })
@ApiResponse({ status: 401, description: 'Autenticação necessária' })
@ApiResponse({ status: 403, description: 'Perfil sem permissão' })
@ApiResponse({ status: 404, description: 'Registro não encontrado' })
@ApiResponse({ status: 409, description: 'Registro duplicado' })
@Controller('instrutores')
export class InstrutoresController {
  constructor(private readonly service: InstrutoresService) {}
  @Get()
  @ApiOperation({ summary: 'Listar instrutores' })
  @ApiQuery({ name: 'turno', required: false, enum: OPCOES_TURNO })
  @ApiQuery({ name: 'todos', required: false, type: Boolean })
  listar(@Query('turno') filtro?: string, @Query('todos') todos?: string) {
    if (
      filtro !== undefined &&
      !(OPCOES_TURNO as readonly unknown[]).includes(filtro)
    )
      throw new BadRequestException('Filtro inválido');
    if (todos !== undefined && !['true', 'false'].includes(todos))
      throw new BadRequestException('Todos deve ser true ou false');
    return this.service.listar(
      filtro === undefined ? undefined : (filtro as Turno),
      todos === 'true',
    );
  }
  @Get(':id')
  @ApiOperation({ summary: 'Buscar instrutor pelo ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }
  @Post()
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Cadastrar instrutor' })
  @ApiResponse({ status: 201, description: 'Registro criado' })
  criar(@Body() dto: CreateInstrutorDto) {
    return this.service.criar(dto);
  }
  @Patch(':id')
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Editar instrutor' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateInstrutorDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id')
  @Perfis('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar instrutor' })
  @ApiResponse({ status: 204, description: 'Registro inativado, sem corpo' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
