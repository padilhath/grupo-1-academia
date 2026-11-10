import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PERFIS, type Perfil } from '../../auth/decorators/perfis.decorator';
export type UsuarioDocument = HydratedDocument<Usuario>;
@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 80 })
  nome: string;
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;
  @Prop({ required: true, select: false }) senhaHash: string;
  @Prop({ required: true, type: String, enum: PERFIS, default: 'consulta' })
  perfil: Perfil;
  @Prop({ default: true }) ativo: boolean;
}
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
UsuarioSchema.index({ perfil: 1 });
