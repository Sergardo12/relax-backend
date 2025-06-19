import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ColaboradorRepository } from "../../domain/repositories/colaborador.repository";
import { ColaboradorOrmEntity } from "../database/colaborador.orm-entity";
import { ColaboradorMapper } from "../mappers/colaborador.mapper";
import { Colaborador } from "../../domain/entities/colaborador.entity";

@Injectable()
export class ColaboradorRepositoryImpl implements ColaboradorRepository {
  constructor(
    @InjectRepository(ColaboradorOrmEntity)
    private readonly ormRepo: Repository<ColaboradorOrmEntity>,
  ) {}

  async crear(colaborador: Colaborador): Promise<Colaborador> {
    const ormEntity = ColaboradorMapper.toOrmEntity(colaborador);
    const guardadoOrmEntity = await this.ormRepo.save(ormEntity);
    return ColaboradorMapper.toDomain(guardadoOrmEntity);
  }

  async buscarPorId(id: number): Promise<Colaborador | null> {
    const colaborador = await this.ormRepo.findOne({
      where: { id },
      relations: ['usuario', 'usuario.rol'],
    });
    return colaborador ? ColaboradorMapper.toDomain(colaborador) : null;
  }

  async listarTodos(): Promise<Colaborador[]> {
    const lista = await this.ormRepo.find({
      where: { estadoColaborador: true },
      relations: ['usuario'],
    });
    return lista.map(ColaboradorMapper.toDomain);
  }

  async actualizar(colaborador: Colaborador): Promise<Colaborador> {
    const ormEntity = ColaboradorMapper.toOrmEntity(colaborador);
    const actualizadoOrmEntity = await this.ormRepo.save(ormEntity);
    return ColaboradorMapper.toDomain(actualizadoOrmEntity);
  }

  async eliminar(id: number): Promise<void> {
    const colaborador = await this.ormRepo.findOne({ where: { id } });
    if (!colaborador) throw new Error('Colaborador no encontrado');

    colaborador.estadoColaborador = false;
    await this.ormRepo.save(colaborador);
  }
}
