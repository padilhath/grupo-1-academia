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
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import {
  OPCOES_DURACAO_MESES,
  type DuracaoMeses,
} from './schemas/plano.schema';

@ApiTags('planos')
@ApiBearerAuth()
@ApiResponse({ status: 400, description: 'Entrada inválida' })
@ApiResponse({ status: 401, description: 'Autenticação necessária' })
@ApiResponse({ status: 403, description: 'Perfil sem permissão' })
@ApiResponse({ status: 404, description: 'Registro não encontrado' })
@ApiResponse({ status: 409, description: 'Registro duplicado' })
@Controller('planos')
export class PlanosController {
  constructor(private readonly service: PlanosService) {}
  @Get()
  @ApiOperation({ summary: 'Listar planos' })
  @ApiQuery({
    name: 'duracaoMeses',
    required: false,
    enum: [...OPCOES_DURACAO_MESES],
  })
  @ApiQuery({ name: 'todos', required: false, type: Boolean })
  listar(
    @Query('duracaoMeses') filtro?: string,
    @Query('todos') todos?: string,
  ) {
    if (
      filtro !== undefined &&
      !(OPCOES_DURACAO_MESES as readonly unknown[]).includes(Number(filtro))
    )
      throw new BadRequestException('Filtro inválido');
    if (todos !== undefined && !['true', 'false'].includes(todos))
      throw new BadRequestException('Todos deve ser true ou false');
    return this.service.listar(
      filtro === undefined ? undefined : (Number(filtro) as DuracaoMeses),
      todos === 'true',
    );
  }
  @Get(':id')
  @ApiOperation({ summary: 'Buscar plano pelo ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }
  @Post()
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Cadastrar plano' })
  @ApiResponse({ status: 201, description: 'Registro criado' })
  criar(@Body() dto: CreatePlanoDto) {
    return this.service.criar(dto);
  }
  @Patch(':id')
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Editar plano' })
  atualizar(@Param('id') id: string, @Body() dto: UpdatePlanoDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id')
  @Perfis('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar plano' })
  @ApiResponse({ status: 204, description: 'Registro inativado, sem corpo' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
