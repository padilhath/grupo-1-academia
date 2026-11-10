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
  Instrutor,
  type InstrutorDocument,
  type Turno,
} from './schemas/instrutor.schema';
import { CreateInstrutorDto } from './dto/create-instrutor.dto';
import { UpdateInstrutorDto } from './dto/update-instrutor.dto';

@Injectable()
export class InstrutoresService {
  private readonly logger = new Logger(InstrutoresService.name);
  constructor(
    @InjectModel(Instrutor.name)
    private readonly model: Model<InstrutorDocument>,
  ) {}
  async listar(turno?: Turno, todos = false): Promise<Instrutor[]> {
    const filtro = {
      ...(todos ? {} : { ativo: true }),
      ...(turno !== undefined ? { turno } : {}),
    };
    return this.model.find(filtro).sort({ nome: 1 }).lean().exec();
  }
  async buscarPorId(id: string): Promise<Instrutor> {
    validarId(id);
    const item = await this.model.findById(id).lean().exec();
    if (!item) throw new NotFoundException('Instrutor não encontrado');
    return item;
  }
  async criar(dto: CreateInstrutorDto): Promise<Instrutor> {
    await this.validar(dto);
    const criado = await this.model.create(dto);
    this.logger.log(`Instrutor criado: ${String(criado._id)}`);
    return criado.toObject();
  }
  async atualizar(id: string, dto: UpdateInstrutorDto): Promise<Instrutor> {
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
    if (!item) throw new NotFoundException('Instrutor não encontrado');
    this.logger.log(`Instrutor atualizado: ${id}`);
    return item;
  }
  async remover(id: string): Promise<void> {
    await this.atualizar(id, { ativo: false });
    this.logger.log(`Instrutor inativado: ${id}`);
  }
  private async validar(
    dto: Partial<CreateInstrutorDto>,
    id?: string,
  ): Promise<void> {
    if (dto.email !== undefined) {
      const existente = await this.model
        .findOne({ email: dto.email })
        .lean()
        .exec();
      if (existente && String(existente._id) !== id)
        throw new ConflictException('Já existe um registro com este email');
    }
    if (dto.cref !== undefined) {
      const existente = await this.model
        .findOne({ cref: nomeExato(dto.cref) })
        .lean()
        .exec();
      if (existente && String(existente._id) !== id)
        throw new ConflictException('Já existe um registro com este cref');
    }
  }
}
