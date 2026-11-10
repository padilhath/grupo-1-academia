import { PartialType } from '@nestjs/swagger';
import { CreateMatriculaDto } from './create-matricula.dto';

// O status NÃO entra aqui: ele só muda pela rota PATCH /:id/status
export class UpdateMatriculaDto extends PartialType(CreateMatriculaDto, {
  skipNullProperties: false,
}) {}
