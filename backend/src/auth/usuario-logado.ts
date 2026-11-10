import { Request } from 'express';
import { Perfil } from './decorators/perfis.decorator';
export interface UsuarioLogado {
  sub: string;
  nome: string;
  perfil: Perfil;
}
export interface RequisicaoAutenticada extends Request {
  usuario: UsuarioLogado;
}
