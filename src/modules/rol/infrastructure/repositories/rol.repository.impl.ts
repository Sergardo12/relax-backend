import { InjectRepository } from "@nestjs/typeorm";
import { RolRepository } from "../../domain/repositories/rol.repository";
import { RolOrmEntity } from "../database/rol.orm-entity";
import { Repository } from "typeorm";
import { Rol } from "../../domain/entities/rol.entity";
import { RolMapper } from "../mappers/rol.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RolRepositoryImpl implements RolRepository {
  constructor(
    @InjectRepository(RolOrmEntity)
    private readonly repo: Repository<RolOrmEntity>,
  ) {}

  async crear(rol: Rol): Promise<Rol> {
    const ormEntity = RolMapper.toOrmEntity(rol);
    const savedOrmEntity = await this.repo.save(ormEntity);
    return RolMapper.toDomain(savedOrmEntity);
  }

  async obtenerPorId(id: number): Promise<Rol | null> {
    const rolOrm = await this.repo.findOne({ where: { id } });
    if (!rolOrm) {
      return null;
    }
    return RolMapper.toDomain(rolOrm);
  }
}