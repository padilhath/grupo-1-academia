import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const OPCOES_OBJETIVO = [
  'emagrecimento',
  'hipertrofia',
  'condicionamento',
  'saude',
] as const;
export type Objetivo = (typeof OPCOES_OBJETIVO)[number];
export type AlunoDocument = HydratedDocument<Aluno>;

@Schema({ timestamps: true, collection: 'alunos' })
export class Aluno {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 80 })
  nome: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true })
  telefone: string;

  @Prop({ type: Date, required: true })
  dataNascimento: Date;

  @Prop({ type: String, required: true, enum: OPCOES_OBJETIVO })
  objetivo: Objetivo;

  @Prop({ default: true })
  ativo: boolean;
}

export const AlunoSchema = SchemaFactory.createForClass(Aluno);
AlunoSchema.index({ objetivo: 1 });
