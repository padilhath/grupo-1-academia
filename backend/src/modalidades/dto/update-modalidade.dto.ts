import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, ValidateIf } from 'class-validator';
import { CreateModalidadeDto } from './create-modalidade.dto';

export class UpdateModalidadeDto extends PartialType(CreateModalidadeDto, {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({ example: true })
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsBoolean()
  ativo?: boolean;
}
