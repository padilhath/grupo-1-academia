import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsByteLength,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class LoginDto {
  @ApiProperty({ example: 'admin@sistema.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;
  @ApiProperty({ example: 'Admin@123' })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  @IsByteLength(1, 72, {
    message: 'Senha deve ocupar no máximo 72 bytes em UTF-8',
  })
  senha: string;
}
