import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { RelatoriosService } from './relatorios.service';
@ApiTags('relatorios')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Autenticação necessária' })
@ApiResponse({
  status: 403,
  description: 'Apenas administradores podem consultar os relatórios',
})
@Perfis('admin')
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly service: RelatoriosService) {}
  @Get('resumo')
  @ApiOperation({
    summary: 'Totais de alunos ativos e matrículas ativas/trancadas',
  })
  resumo() {
    return this.service.resumo();
  }
  @Get('receita-por-plano')
  @ApiOperation({
    summary: 'Matrículas ativas e receita mensal agrupadas por plano',
  })
  receitaPorPlano() {
    return this.service.receitaPorPlano();
  }
  @Get('alunos-por-objetivo')
  @ApiOperation({ summary: 'Alunos ativos agrupados por objetivo' })
  alunosPorObjetivo() {
    return this.service.alunosPorObjetivo();
  }
}
