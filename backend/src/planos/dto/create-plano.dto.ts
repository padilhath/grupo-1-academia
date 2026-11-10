import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import {
  OPCOES_DURACAO_MESES,
  type DuracaoMeses,
} from '../schemas/plano.schema';

export class CreatePlanoDto {
  @ApiProperty({ example: 'Musculação trimestral' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 60, { message: 'Nome deve ter entre 3 e 60 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  nome: string;

  @ApiProperty({ example: '665f1c2b9a1e4b0012345678' })
  @IsMongoId({ message: 'Modalidade: id inválido' })
  modalidade: string;

  @ApiProperty({ example: 99.9 })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Valor mensal (R$) deve ser um número' },
  )
  @Min(1, { message: 'Valor mensal (R$) deve ser no mínimo 1' })
  valorMensal: number;

  @ApiProperty({ enum: OPCOES_DURACAO_MESES, example: 3 })
  @IsIn(OPCOES_DURACAO_MESES, {
    message: `Duração (meses) deve ser: ${OPCOES_DURACAO_MESES.join(', ')}`,
  })
  duracaoMeses: DuracaoMeses;
}
