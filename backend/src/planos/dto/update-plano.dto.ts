import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, ValidateIf } from 'class-validator';
import { CreatePlanoDto } from './create-plano.dto';

export class UpdatePlanoDto extends PartialType(CreatePlanoDto, {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({ example: true })
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsBoolean()
  ativo?: boolean;
}
