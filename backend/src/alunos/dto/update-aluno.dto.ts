import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, ValidateIf } from 'class-validator';
import { CreateAlunoDto } from './create-aluno.dto';

export class UpdateAlunoDto extends PartialType(CreateAlunoDto, {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({ example: true })
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsBoolean()
  ativo?: boolean;
}
