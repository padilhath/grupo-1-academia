import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validarId, validarIdade } from '../academia/validacao';
import {
  Aluno,
  type AlunoDocument,
  type Objetivo,
} from './schemas/aluno.schema';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Injectable()
export class AlunosService {
  private readonly logger = new Logger(AlunosService.name);
  constructor(
    @InjectModel(Aluno.name) private readonly model: Model<AlunoDocument>,
  ) {}
  async listar(objetivo?: Objetivo, todos = false): Promise<Aluno[]> {
    const filtro = {
      ...(todos ? {} : { ativo: true }),
      ...(objetivo !== undefined ? { objetivo } : {}),
    };
    return this.model.find(filtro).sort({ nome: 1 }).lean().exec();
  }
  async buscarPorId(id: string): Promise<Aluno> {
    validarId(id);
    const item = await this.model.findById(id).lean().exec();
    if (!item) throw new NotFoundException('Aluno não encontrado');
    return item;
  }
  async criar(dto: CreateAlunoDto): Promise<Aluno> {
    await this.validar(dto);
    const criado = await this.model.create(dto);
    this.logger.log(`Aluno criado: ${String(criado._id)}`);
    return criado.toObject();
  }
  async atualizar(id: string, dto: UpdateAlunoDto): Promise<Aluno> {
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
    if (!item) throw new NotFoundException('Aluno não encontrado');
    this.logger.log(`Aluno atualizado: ${id}`);
    return item;
  }
  async remover(id: string): Promise<void> {
    await this.atualizar(id, { ativo: false });
    this.logger.log(`Aluno inativado: ${id}`);
  }
  private async validar(
    dto: Partial<CreateAlunoDto>,
    id?: string,
  ): Promise<void> {
    if (dto.dataNascimento) validarIdade(dto.dataNascimento);
    if (dto.email !== undefined) {
      const existente = await this.model
        .findOne({ email: dto.email })
        .lean()
        .exec();
      if (existente && String(existente._id) !== id)
        throw new ConflictException('Já existe um registro com este email');
    }
  }
}
