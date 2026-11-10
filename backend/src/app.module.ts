import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AlunosModule } from './alunos/alunos.module';
import { PlanosModule } from './planos/planos.module';
import { InstrutoresModule } from './instrutores/instrutores.module';
import { ModalidadesModule } from './modalidades/modalidades.module';
import { MatriculasModule } from './matriculas/matriculas.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'MONGODB_URI',
          'mongodb://127.0.0.1:27017/projeto-integrador',
        ),
        serverSelectionTimeoutMS: 5000,
      }),
    }),
    AlunosModule,
    PlanosModule,
    InstrutoresModule,
    ModalidadesModule,
    MatriculasModule,
    RelatoriosModule,
    AuthModule,
  ],
})
export class AppModule {}
