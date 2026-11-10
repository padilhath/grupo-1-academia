import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Instrutor, InstrutorSchema } from './schemas/instrutor.schema';
import { InstrutoresService } from './instrutores.service';
import { InstrutoresController } from './instrutores.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instrutor.name, schema: InstrutorSchema },
    ]),
  ],
  controllers: [InstrutoresController],
  providers: [InstrutoresService],
  exports: [InstrutoresService],
})
export class InstrutoresModule {}
