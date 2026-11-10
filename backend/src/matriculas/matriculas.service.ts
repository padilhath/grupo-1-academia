import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { validarId, validarDataInicio } from '../academia/validacao';
import { AlunosService } from '../alunos/alunos.service';
import { PlanosService } from '../planos/planos.service';
import { InstrutoresService } from '../instrutores/instrutores.service';
import {
  Matricula,
  type MatriculaDocument,
  type Status,
} from './schemas/matricula.schema';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
export const TRANSICOES: Record<Status, Status[]> = {
  ativa: ['trancada', 'cancelada'],
  trancada: ['ativa', 'cancelada'],
  cancelada: [],
};
@Injectable()
export class MatriculasService {
  private readonly logger = new Logger(MatriculasService.name);
  constructor(
    @InjectModel(Matricula.name)
    private readonly model: Model<MatriculaDocument>,
    private readonly alunos: AlunosService,
    private readonly planos: PlanosService,
    private readonly instrutores: InstrutoresService,
  ) {}
  async listar(status?: Status): Promise<Matricula[]> {
    return this.model
      .find(status ? { status } : {})
      .populate('aluno', 'nome ativo')
      .populate('plano', 'nome ativo')
      .populate('instrutor', 'nome ativo')
      .sort({ dataInicio: -1, _id: -1 })
      .lean()
      .exec();
  }
  async buscarPorId(id: string): Promise<Matricula> {
    validarId(id);
    const item = await this.model
      .findById(id)
      .populate('aluno', 'nome ativo')
      .populate('plano', 'nome ativo')
      .populate('instrutor', 'nome ativo')
      .lean()
      .exec();
    if (!item) throw new NotFoundException('Matrícula não encontrada');
    return item;
  }
  async criar(dto: CreateMatriculaDto): Promise<Matricula> {
    validarDataInicio(dto.dataInicio);
    await this.validarReferencias(dto);
    await this.garantirAtivaUnica(dto.aluno);
    const criada = await this.model.create({ ...dto, status: 'ativa' });
    this.logger.log(`Matrícula criada: ${String(criada._id)}`);
    return criada.toObject();
  }
  async atualizar(id: string, dto: UpdateMatriculaDto): Promise<Matricula> {
    const atual = await this.buscarPorId(id);
    if (
      dto.dataInicio &&
      dto.dataInicio !== new Date(atual.dataInicio).toISOString().slice(0, 10)
    )
      validarDataInicio(dto.dataInicio);
    await this.validarReferencias(dto);
    if (dto.aluno && atual.status === 'ativa')
      await this.garantirAtivaUnica(dto.aluno, id);
    const item = await this.model
      .findOneAndUpdate(
        { _id: id, status: atual.status },
        { $set: dto },
        { returnDocument: 'after', runValidators: true },
      )
      .lean()
      .exec();
    if (!item)
      throw new ConflictException(
        'A matrícula foi alterada. Atualize a lista e tente novamente.',
      );
    this.logger.log(`Matrícula atualizada: ${id}`);
    return item;
  }
  async mudarStatus(id: string, novo: Status): Promise<Matricula> {
    const atual = await this.buscarPorId(id);
    if (!TRANSICOES[atual.status].includes(novo))
      throw new BadRequestException(
        `Não é possível passar de "${atual.status}" para "${novo}"`,
      );
    if (novo === 'ativa') {
      const idDe = (v: unknown): string => {
        const ref = v as { _id?: unknown } | null;
        return String(ref?._id ?? v);
      };
      await this.validarReferencias({
        aluno: idDe(atual.aluno),
        plano: idDe(atual.plano),
        instrutor: idDe(atual.instrutor),
      });
      await this.garantirAtivaUnica(idDe(atual.aluno), id);
    }
    const item = await this.model
      .findOneAndUpdate(
        { _id: id, status: atual.status },
        { $set: { status: novo } },
        { returnDocument: 'after', runValidators: true },
      )
      .lean()
      .exec();
    if (!item)
      throw new ConflictException(
        'A matrícula foi alterada. Atualize a lista e tente novamente.',
      );
    this.logger.log(`Matrícula ${id}: ${atual.status} → ${novo}`);
    return item;
  }
  private async garantirAtivaUnica(aluno: string, id?: string): Promise<void> {
    const existente = await this.model
      .findOne({ aluno, status: 'ativa' })
      .lean()
      .exec();
    if (existente && String(existente._id) !== id)
      throw new ConflictException('O aluno já possui uma matrícula ativa');
  }
  private async validarReferencias(
    dto: Partial<CreateMatriculaDto>,
  ): Promise<void> {
    const referencias = [
      dto.aluno ? this.alunos.buscarPorId(dto.aluno) : Promise.resolve(null),
      dto.plano ? this.planos.buscarPorId(dto.plano) : Promise.resolve(null),
      dto.instrutor
        ? this.instrutores.buscarPorId(dto.instrutor)
        : Promise.resolve(null),
    ];
    const itens = await Promise.all(referencias);
    if (itens.some((item) => item && !item.ativo))
      throw new BadRequestException(
        'Aluno, plano e instrutor devem estar ativos',
      );
  }
}
