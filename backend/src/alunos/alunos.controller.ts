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
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { OPCOES_OBJETIVO, type Objetivo } from './schemas/aluno.schema';

@ApiTags('alunos')
@ApiBearerAuth()
@ApiResponse({ status: 400, description: 'Entrada inválida' })
@ApiResponse({ status: 401, description: 'Autenticação necessária' })
@ApiResponse({ status: 403, description: 'Perfil sem permissão' })
@ApiResponse({ status: 404, description: 'Registro não encontrado' })
@ApiResponse({ status: 409, description: 'Registro duplicado' })
@Controller('alunos')
export class AlunosController {
  constructor(private readonly service: AlunosService) {}
  @Get()
  @ApiOperation({ summary: 'Listar alunos' })
  @ApiQuery({ name: 'objetivo', required: false, enum: OPCOES_OBJETIVO })
  @ApiQuery({ name: 'todos', required: false, type: Boolean })
  listar(@Query('objetivo') filtro?: string, @Query('todos') todos?: string) {
    if (
      filtro !== undefined &&
      !(OPCOES_OBJETIVO as readonly unknown[]).includes(filtro)
    )
      throw new BadRequestException('Filtro inválido');
    if (todos !== undefined && !['true', 'false'].includes(todos))
      throw new BadRequestException('Todos deve ser true ou false');
    return this.service.listar(
      filtro === undefined ? undefined : (filtro as Objetivo),
      todos === 'true',
    );
  }
  @Get(':id')
  @ApiOperation({ summary: 'Buscar aluno pelo ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }
  @Post()
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Cadastrar aluno' })
  @ApiResponse({ status: 201, description: 'Registro criado' })
  criar(@Body() dto: CreateAlunoDto) {
    return this.service.criar(dto);
  }
  @Patch(':id')
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Editar aluno' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateAlunoDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id')
  @Perfis('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar aluno' })
  @ApiResponse({ status: 204, description: 'Registro inativado, sem corpo' })
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
