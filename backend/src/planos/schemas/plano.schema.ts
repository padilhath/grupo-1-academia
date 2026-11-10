import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export const OPCOES_DURACAO_MESES = [1, 3, 6, 12] as const;
export type DuracaoMeses = (typeof OPCOES_DURACAO_MESES)[number];
export type PlanoDocument = HydratedDocument<Plano>;

@Schema({ timestamps: true, collection: 'planos' })
export class Plano {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 60,
  })
  nome: string;

  // Referência ao módulo Modalidade: guarda só o _id
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Modalidade',
    required: true,
  })
  modalidade: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  valorMensal: number;

  @Prop({ type: Number, required: true, enum: OPCOES_DURACAO_MESES })
  duracaoMeses: DuracaoMeses;

  @Prop({ default: true })
  ativo: boolean;
}

export const PlanoSchema = SchemaFactory.createForClass(Plano);
PlanoSchema.index({ modalidade: 1 });
PlanoSchema.index({ duracaoMeses: 1 });

PlanoSchema.index(
  { nome: 1 },
  { unique: true, collation: { locale: 'pt', strength: 2 } },
);
