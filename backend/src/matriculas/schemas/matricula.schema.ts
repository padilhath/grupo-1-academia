import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export const STATUS = ['ativa', 'trancada', 'cancelada'] as const;
export type Status = (typeof STATUS)[number];

export type MatriculaDocument = HydratedDocument<Matricula>;

@Schema({ timestamps: true, collection: 'matriculas' })
export class Matricula {
  // Referência ao módulo Aluno: guarda só o _id
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Aluno', required: true })
  aluno: Types.ObjectId;

  // Referência ao módulo Plano: guarda só o _id
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Plano', required: true })
  plano: Types.ObjectId;

  // Referência ao módulo Instrutor: guarda só o _id
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Instrutor',
    required: true,
  })
  instrutor: Types.ObjectId;

  @Prop({ type: Date, required: true })
  dataInicio: Date;

  // Fluxo de estados: o status começa em "ativa" e só muda pela rota PATCH /matriculas/:id/status
  @Prop({ type: String, enum: STATUS, default: 'ativa' })
  status: Status;
}

export const MatriculaSchema = SchemaFactory.createForClass(Matricula);
MatriculaSchema.index(
  { aluno: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'ativa' },
    name: 'uma_matricula_ativa_por_aluno',
  },
);
MatriculaSchema.index({ plano: 1 });
MatriculaSchema.index({ instrutor: 1 });
MatriculaSchema.index({ status: 1 });
