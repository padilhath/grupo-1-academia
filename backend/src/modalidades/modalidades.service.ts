import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validarId, nomeExato } from '../academia/validacao';
import {
  Modalidade,
  type ModalidadeDocument,
  type Intensidade,
} from './schemas/modalidade.schema';
import { CreateModalidadeDto } from './dto/create-modalidade.dto';
import { UpdateModalidadeDto } from './dto/update-modalidade.dto';

@Injectable()
export class ModalidadesService {
  private readonly logger = new Logger(ModalidadesService.name);
  constructor(
    @InjectModel(Modalidade.name)
    private readonly model: Model<ModalidadeDocument>,
  ) {}
  async listar(
    intensidade?: Intensidade,
    todos = false,
  ): Promise<Modalidade[]> {
    const filtro = {
      ...(todos ? {} : { ativo: true }),
      ...(intensidade !== undefined ? { intensidade } : {}),
    };
    return this.model.find(filtro).sort({ nome: 1 }).lean().exec();
  }
  async buscarPorId(id: string): Promise<Modalidade> {
    validarId(id);
    const item = await this.model.findById(id).lean().exec();
    if (!item) throw new NotFoundException('Modalidade não encontrado');
    return item;
  }
  async criar(dto: CreateModalidadeDto): Promise<Modalidade> {
    await this.validar(dto);
    const criado = await this.model.create(dto);
    this.logger.log(`Modalidade criado: ${String(criado._id)}`);
    return criado.toObject();
  }
  async atualizar(id: string, dto: UpdateModalidadeDto): Promise<Modalidade> {
    await this.buscarPorId(id);
    await this.validar(dto, id);
    const item = await this.model
      .findByIdAndUpdate(
        id,
        { $set: dto },
        { returnDocument: 'after', runValidators: true },
      )
      .lean()
      .exec();
    if (!item) throw new NotFoundException('Modalidade não encontrado');
    this.logger.log(`Modalidade atualizado: ${id}`);
    return item;
  }
  async remover(id: string): Promise<void> {
    await this.atualizar(id, { ativo: false });
    this.logger.log(`Modalidade inativado: ${id}`);
  }
  private async validar(
    dto: Partial<CreateModalidadeDto>,
    id?: string,
  ): Promise<void> {
    if (dto.nome !== undefined) {
      const existente = await this.model
        .findOne({ nome: nomeExato(dto.nome) })
        .lean()
        .exec();
      if (existente && String(existente._id) !== id)
        throw new ConflictException('Já existe um registro com este nome');
    }
  }
}
