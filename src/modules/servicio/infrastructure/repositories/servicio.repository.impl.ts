import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServicioRepository } from "../../domain/repositories/servicio.repository";
import { Servicio } from "../../domain/entities/servicio.entity";
import { ServicioOrmEntity } from "../database/servicio.orm-entity";
import { ServicioMapper } from "../mappers/servicio.mapper";

@Injectable()
export class ServicioRepositoryImpl implements ServicioRepository {
  constructor(
    @InjectRepository(ServicioOrmEntity)
    private readonly ormRepo: Repository<ServicioOrmEntity>,
  ) {}

  async crear(servicio: Servicio): Promise<Servicio> {
    const ormEntity = ServicioMapper.toOrmEntity(servicio);
    const savedOrmEntity = await this.ormRepo.save(ormEntity);
    return ServicioMapper.toDomain(savedOrmEntity);
  }

  async buscarPorId(id: number): Promise<Servicio | null> {
    const servicio = await this.ormRepo.findOne({ where: { id } });
    return servicio ? ServicioMapper.toDomain(servicio) : null;
  }
}