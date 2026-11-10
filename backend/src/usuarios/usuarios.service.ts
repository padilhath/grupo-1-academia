import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { validarId } from '../academia/validacao';
import { Usuario, type UsuarioDocument } from './schemas/usuario.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);
  constructor(
    @InjectModel(Usuario.name) private readonly model: Model<UsuarioDocument>,
  ) {}
  async criar(dto: CreateUsuarioDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.model.findOne({ email }).lean().exec())
      throw new ConflictException('E-mail já cadastrado');
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const criado = await this.model.create({
      nome: dto.nome.trim(),
      email,
      senhaHash,
      perfil: dto.perfil ?? 'consulta',
      ativo: true,
    });
    const usuario = criado.toObject();
    const { senhaHash: hash, ...publico } = usuario;
    void hash;
    this.logger.log(`Usuário criado: ${String(criado._id)}`);
    return publico;
  }
  async buscarPorEmailComSenha(email: string) {
    return this.model
      .findOne({ email: email.trim().toLowerCase() })
      .select('+senhaHash')
      .lean()
      .exec();
  }
  async buscarPorId(id: string) {
    validarId(id);
    const usuario = await this.model.findById(id).lean().exec();
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }
}
