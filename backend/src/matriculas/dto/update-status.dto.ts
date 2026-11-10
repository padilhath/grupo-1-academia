import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { STATUS, type Status } from '../schemas/matricula.schema';
export class UpdateStatusDto {
  @ApiProperty({ enum: STATUS })
  @IsIn(STATUS, { message: 'Status deve ser ativa, trancada ou cancelada' })
  status: Status;
}
