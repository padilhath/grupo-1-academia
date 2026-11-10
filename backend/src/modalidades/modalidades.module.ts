import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Modalidade, ModalidadeSchema } from './schemas/modalidade.schema';
import { ModalidadesService } from './modalidades.service';
import { ModalidadesController } from './modalidades.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Modalidade.name, schema: ModalidadeSchema },
    ]),
  ],
  controllers: [ModalidadesController],
  providers: [ModalidadesService],
  exports: [ModalidadesService],
})
export class ModalidadesModule {}
