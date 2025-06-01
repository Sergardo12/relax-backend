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
        private readonly ormRepo: Repository<ColaboradorOrmEntity>
    ) { }

    async obtenerPorId(id: number): Promise<Colaborador | null> {
        const orm = await this.ormRepo.findOneBy({ idColaborador: id });
        return orm ? ColaboradorMapper.toDomain(orm) : null;
    }
}
