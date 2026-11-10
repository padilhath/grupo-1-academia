import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, ValidateIf } from 'class-validator';
import { CreateInstrutorDto } from './create-instrutor.dto';

export class UpdateInstrutorDto extends PartialType(CreateInstrutorDto, {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({ example: true })
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsBoolean()
  ativo?: boolean;
}
