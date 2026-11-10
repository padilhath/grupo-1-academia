import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plano, PlanoSchema } from './schemas/plano.schema';
import { PlanosService } from './planos.service';
import { PlanosController } from './planos.controller';
import { ModalidadesModule } from '../modalidades/modalidades.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plano.name, schema: PlanoSchema }]),
    ModalidadesModule,
  ],
  controllers: [PlanosController],
  providers: [PlanosService],
  exports: [PlanosService],
})
export class PlanosModule {}
