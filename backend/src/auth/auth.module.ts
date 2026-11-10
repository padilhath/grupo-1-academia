import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PerfisGuard } from './guards/perfis.guard';
@Module({
  imports: [
    UsuariosModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        if (secret.length < 32 || secret.startsWith('troque-'))
          throw new Error(
            'Configure JWT_SECRET com pelo menos 32 caracteres aleatórios',
          );
        return { secret, signOptions: { expiresIn: '1h', algorithm: 'HS256' } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PerfisGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
