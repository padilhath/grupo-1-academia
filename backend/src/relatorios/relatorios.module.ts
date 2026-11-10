import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Aluno, AlunoSchema } from '../alunos/schemas/aluno.schema';
import {
  Matricula,
  MatriculaSchema,
} from '../matriculas/schemas/matricula.schema';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Aluno.name, schema: AlunoSchema },
      { name: Matricula.name, schema: MatriculaSchema },
    ]),
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
