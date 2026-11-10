import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsByteLength,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PERFIS, type Perfil } from '../../auth/decorators/perfis.decorator';
export class CreateUsuarioDto {
  @ApiProperty({ example: 'Ana Silva' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(3, 80, { message: 'Nome deve ter entre 3 e 80 caracteres' })
  nome: string;
  @ApiProperty({ example: 'ana@academia.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;
  @ApiProperty({ minLength: 8, maxLength: 72, example: 'Senha@123' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @MaxLength(72, { message: 'Senha deve ter no máximo 72 caracteres' })
  @IsByteLength(1, 72, {
    message: 'Senha deve ocupar no máximo 72 bytes em UTF-8',
  })
  senha: string;
  @ApiPropertyOptional({ enum: PERFIS, default: 'consulta' })
  @IsOptional()
  @IsIn(PERFIS, { message: 'Perfil inválido' })
  perfil?: Perfil;
}
export class CadastroDto extends OmitType(CreateUsuarioDto, [
  'perfil',
] as const) {}
