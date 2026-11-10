import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { STATUS, type Status } from './schemas/matricula.schema';
@ApiTags('matriculas')
@ApiBearerAuth()
@ApiResponse({ status: 400, description: 'Dados ou transição inválidos' })
@ApiResponse({ status: 401, description: 'Autenticação necessária' })
@ApiResponse({ status: 403, description: 'Perfil sem permissão' })
@ApiResponse({
  status: 404,
  description: 'Matrícula ou referência inexistente',
})
@ApiResponse({
  status: 409,
  description: 'Matrícula ativa duplicada ou atualização concorrente',
})
@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly service: MatriculasService) {}
  @Get()
  @ApiOperation({ summary: 'Listar matrículas com nomes das referências' })
  @ApiQuery({ name: 'status', required: false, enum: STATUS })
  listar(@Query('status') status?: Status) {
    if (status !== undefined && !STATUS.includes(status))
      throw new BadRequestException('Status inválido');
    return this.service.listar(status);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Buscar matrícula por ID' })
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }
  @Post()
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Criar matrícula ativa' })
  @ApiResponse({ status: 201, description: 'Matrícula criada' })
  criar(@Body() dto: CreateMatriculaDto) {
    return this.service.criar(dto);
  }
  @Patch(':id')
  @Perfis('admin', 'atendente')
  @ApiOperation({ summary: 'Editar dados da matrícula preservando o status' })
  atualizar(@Param('id') id: string, @Body() dto: UpdateMatriculaDto) {
    return this.service.atualizar(id, dto);
  }
  @Patch(':id/status')
  @Perfis('admin', 'atendente')
  @ApiOperation({
    summary: 'Trancar, reativar ou cancelar matrícula conforme o estado atual',
  })
  mudarStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.mudarStatus(id, dto.status);
  }
}
