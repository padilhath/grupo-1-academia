import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, Matches, IsMongoId } from 'class-validator';

export class CreateMatriculaDto {
  @ApiProperty({ example: '665f1c2b9a1e4b0012345678' })
  @IsMongoId({ message: 'Aluno: id inválido' })
  aluno: string;

  @ApiProperty({ example: '665f1c2b9a1e4b0012345678' })
  @IsMongoId({ message: 'Plano: id inválido' })
  plano: string;

  @ApiProperty({ example: '665f1c2b9a1e4b0012345678' })
  @IsMongoId({ message: 'Instrutor responsável: id inválido' })
  instrutor: string;

  @ApiProperty({ example: '2026-11-03' })
  @IsDateString(
    { strict: true },
    { message: 'Data de início deve ser uma data válida' },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Use a data no formato AAAA-MM-DD',
  })
  dataInicio: string;
}
