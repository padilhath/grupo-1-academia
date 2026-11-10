import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  OPCOES_INTENSIDADE,
  type Intensidade,
} from '../schemas/modalidade.schema';

export class CreateModalidadeDto {
  @ApiProperty({ example: 'Musculação' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 50, { message: 'Nome deve ter entre 3 e 50 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  nome: string;

  @ApiPropertyOptional({ example: 'Treino com pesos e aparelhos' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'Descrição pode ter no máximo 300 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  descricao?: string;

  @ApiProperty({ enum: OPCOES_INTENSIDADE, example: 'moderada' })
  @IsIn(OPCOES_INTENSIDADE, {
    message: `Intensidade deve ser: ${OPCOES_INTENSIDADE.join(', ')}`,
  })
  intensidade: Intensidade;

  @ApiProperty({ example: 20 })
  @IsInt({ message: 'Capacidade máxima por turma deve ser um número inteiro' })
  @Min(1, { message: 'Capacidade máxima por turma deve ser no mínimo 1' })
  @Max(50, { message: 'Capacidade máxima por turma deve ser no máximo 50' })
  capacidadeMaxima: number;
}
