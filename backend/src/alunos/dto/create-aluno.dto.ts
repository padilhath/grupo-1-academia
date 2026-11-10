import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { OPCOES_OBJETIVO, type Objetivo } from '../schemas/aluno.schema';

export class CreateAlunoDto {
  @ApiProperty({ example: 'Maria Souza' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 80, { message: 'Nome deve ter entre 3 e 80 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  nome: string;

  @ApiProperty({ example: 'maria.souza@email.com' })
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

  @ApiProperty({ example: '2004-08-10' })
  @IsDateString(
    { strict: true },
    { message: 'Data de nascimento deve ser uma data válida' },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Use a data no formato AAAA-MM-DD',
  })
  dataNascimento: string;

  @ApiProperty({ enum: OPCOES_OBJETIVO, example: 'condicionamento' })
  @IsIn(OPCOES_OBJETIVO, {
    message: `Objetivo deve ser: ${OPCOES_OBJETIVO.join(', ')}`,
  })
  objetivo: Objetivo;
}
