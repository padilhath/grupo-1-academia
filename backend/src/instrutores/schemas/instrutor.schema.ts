import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const OPCOES_TURNO = ['manha', 'tarde', 'noite'] as const;
export type Turno = (typeof OPCOES_TURNO)[number];
export type InstrutorDocument = HydratedDocument<Instrutor>;

@Schema({ timestamps: true, collection: 'instrutores' })
export class Instrutor {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 80 })
  nome: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true })
  telefone: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 15,
    unique: true,
    uppercase: true,
  })
  cref: string;

  @Prop({ type: String, required: true, enum: OPCOES_TURNO })
  turno: Turno;

  @Prop({ default: true })
  ativo: boolean;
}

export const InstrutorSchema = SchemaFactory.createForClass(Instrutor);
InstrutorSchema.index({ turno: 1 });
