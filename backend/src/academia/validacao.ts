import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
export function validarId(id: string): void {
  if (!isValidObjectId(id))
    throw new BadRequestException(`O id "${id}" não é válido`);
}
export function hoje(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());
}
export function validarIdade(valor: string | Date): void {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime()))
    throw new BadRequestException('Data de nascimento inválida');
  const nascimento = data.toISOString().slice(0, 10);
  const atual = hoje();
  const idade =
    Number(atual.slice(0, 4)) -
    Number(nascimento.slice(0, 4)) -
    (atual.slice(5) < nascimento.slice(5) ? 1 : 0);
  if (idade < 14)
    throw new BadRequestException('A idade mínima para matrícula é 14 anos');
}
export function validarDataInicio(valor: string): void {
  if (valor.slice(0, 10) < hoje())
    throw new BadRequestException('A data de início não pode estar no passado');
}
export function nomeExato(valor: string): RegExp {
  return new RegExp(
    '^' + valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$',
    'i',
  );
}
