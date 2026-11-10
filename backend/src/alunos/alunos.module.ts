import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Aluno, AlunoSchema } from './schemas/aluno.schema';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Aluno.name, schema: AlunoSchema }]),
  ],
  controllers: [AlunosController],
  providers: [AlunosService],
  exports: [AlunosService],
})
export class AlunosModule {}
