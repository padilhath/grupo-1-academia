import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validarId, nomeExato } from '../academia/validacao';
import {
  Plano,
  type PlanoDocument,
  type DuracaoMeses,
} from './schemas/plano.schema';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { ModalidadesService } from '../modalidades/modalidades.service';

@Injectable()
export class PlanosService {
  private readonly logger = new Logger(PlanosService.name);
  constructor(
    @InjectModel(Plano.name) private readonly model: Model<PlanoDocument>,
    private readonly modalidadesService: ModalidadesService,
  ) {}
  async listar(duracaoMeses?: DuracaoMeses, todos = false): Promise<Plano[]> {
    const filtro = {
      ...(todos ? {} : { ativo: true }),
      ...(duracaoMeses !== undefined ? { duracaoMeses } : {}),
    };
    return this.model
      .find(filtro)
      .populate('modalidade', 'nome ativo')
      .sort({ nome: 1 })
      .lean()
      .exec();
  }
  async buscarPorId(id: string): Promise<Plano> {
    validarId(id);
    const item = await this.model
      .findById(id)
      .populate('modalidade', 'nome ativo')
      .lean()
      .exec();
    if (!item) throw new NotFoundException('Plano não encontrado');
    return item;
  }
  async criar(dto: CreatePlanoDto): Promise<Plano> {
    await this.validar(dto);
    const criado = await this.model.create(dto);
    this.logger.log(`Plano criado: ${String(criado._id)}`);
    return criado.toObject();
  }
  async atualizar(id: string, dto: UpdatePlanoDto): Promise<Plano> {
    await this.buscarPorId(id);
    await this.validar(dto, id);
    const item = await this.model
      .findByIdAndUpdate(
        id,
        { $set: dto },
        { returnDocument: 'after', runValidators: true },
      )
      .populate('modalidade', 'nome ativo')
      .lean()
      .exec();
    if (!item) throw new NotFoundException('Plano não encontrado');
    this.logger.log(`Plano atualizado: ${id}`);
    return item;
  }
  async remover(id: string): Promise<void> {
    await this.atualizar(id, { ativo: false });
    this.logger.log(`Plano inativado: ${id}`);
  }
  private async validar(
    dto: Partial<CreatePlanoDto>,
    id?: string,
  ): Promise<void> {
    if (dto.modalidade) {
      const modalidade = await this.modalidadesService.buscarPorId(
        dto.modalidade,
      );
      if (!modalidade.ativo)
        throw new BadRequestException('A modalidade precisa estar ativa');
    }
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
