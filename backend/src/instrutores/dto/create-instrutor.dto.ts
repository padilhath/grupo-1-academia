import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { OPCOES_TURNO, type Turno } from '../schemas/instrutor.schema';

export class CreateInstrutorDto {
  @ApiProperty({ example: 'Maria Souza' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 80, { message: 'Nome deve ter entre 3 e 80 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  nome: string;

  @ApiProperty({ example: 'joao.personal@academia.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @ApiProperty({ example: '(51) 99876-5432' })
  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
    message: 'Telefone inválido. Use o formato (51) 99999-9999',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  telefone: string;

  @ApiProperty({ example: '012345-G/RS' })
  @IsString()
  @IsNotEmpty({ message: 'CREF é obrigatório' })
  @Length(6, 15, { message: 'CREF deve ter entre 6 e 15 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  cref: string;

  @ApiProperty({ enum: OPCOES_TURNO, example: 'noite' })
  @IsIn(OPCOES_TURNO, { message: `Turno deve ser: ${OPCOES_TURNO.join(', ')}` })
  turno: Turno;
}
