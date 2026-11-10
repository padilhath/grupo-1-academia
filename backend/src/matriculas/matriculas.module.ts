import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Matricula, MatriculaSchema } from './schemas/matricula.schema';
import { MatriculasService } from './matriculas.service';
import { MatriculasController } from './matriculas.controller';
import { AlunosModule } from '../alunos/alunos.module';
import { PlanosModule } from '../planos/planos.module';
import { InstrutoresModule } from '../instrutores/instrutores.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Matricula.name, schema: MatriculaSchema },
    ]),
    AlunosModule,
    PlanosModule,
    InstrutoresModule,
  ],
  controllers: [MatriculasController],
  providers: [MatriculasService],
  exports: [MatriculasService],
})
export class MatriculasModule {}
