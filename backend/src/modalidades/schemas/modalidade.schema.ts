import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const OPCOES_INTENSIDADE = ['leve', 'moderada', 'intensa'] as const;
export type Intensidade = (typeof OPCOES_INTENSIDADE)[number];
export type ModalidadeDocument = HydratedDocument<Modalidade>;

@Schema({ timestamps: true, collection: 'modalidades' })
export class Modalidade {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  })
  nome: string;

  @Prop({ trim: true, maxlength: 300 })
  descricao?: string;

  @Prop({ type: String, required: true, enum: OPCOES_INTENSIDADE })
  intensidade: Intensidade;

  @Prop({
    required: true,
    min: 1,
    max: 50,
    validate: {
      validator: Number.isInteger,
      message: 'Capacidade deve ser inteira',
    },
  })
  capacidadeMaxima: number;

  @Prop({ default: true })
  ativo: boolean;
}

export const ModalidadeSchema = SchemaFactory.createForClass(Modalidade);
ModalidadeSchema.index({ intensidade: 1 });

ModalidadeSchema.index(
  { nome: 1 },
  { unique: true, collation: { locale: 'pt', strength: 2 } },
);
