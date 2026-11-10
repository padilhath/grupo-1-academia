import { MatriculaSchema } from '../matriculas/schemas/matricula.schema';
import { PlanoSchema } from '../planos/schemas/plano.schema';
import { UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { nomeExato, validarIdade } from './validacao';
import { BadRequestException } from '@nestjs/common';
describe('Integridade da modelagem e validações', () => {
  it('armazena referências como ObjectId, não como Mixed/texto', () => {
    for (const campo of ['aluno', 'plano', 'instrutor'])
      expect(MatriculaSchema.path(campo).instance).toBe('ObjectId');
    expect(PlanoSchema.path('modalidade').instance).toBe('ObjectId');
  });
  it('garante matrícula ativa única também no banco', () => {
    expect(MatriculaSchema.indexes()).toEqual(
      expect.arrayContaining([
        [
          { aluno: 1 },
          expect.objectContaining({
            unique: true,
            partialFilterExpression: { status: 'ativa' },
          }),
        ],
      ]),
    );
  });
  it('oculta hash nas buscas comuns', () => {
    expect(UsuarioSchema.path('senhaHash').options.select).toBe(false);
  });
  it('escapa operadores de regex na busca de duplicidade', () => {
    const regex = nomeExato('Plano (A+B).*');
    expect(regex.test('plano (a+b).*')).toBe(true);
    expect(regex.test('Plano AAAB xyz')).toBe(false);
  });
  it('rejeita idade abaixo de 14 e aceita aniversário exato', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-10T15:00:00Z'));
    try {
      expect(() => validarIdade('2012-11-11')).toThrow(BadRequestException);
      expect(() => validarIdade('2012-11-10')).not.toThrow();
    } finally {
      jest.useRealTimers();
    }
  });
  it('retorna erro de entrada para uma data inválida', () => {
    expect(() => validarIdade('inválida')).toThrow(BadRequestException);
  });
});
