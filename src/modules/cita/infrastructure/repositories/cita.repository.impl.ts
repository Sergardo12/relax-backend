import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CitaRepository } from "../../domain/repositories/cita.repository";
import { Cita } from "../../domain/entities/cita.entity";
import { CitaOrmEntity } from "../database/cita.orm-entity";
import { CitaMapper } from "../mappers/cita.mapper";

@Injectable()
export class CitaRepositoryImpl implements CitaRepository {
    constructor(
        @InjectRepository(CitaOrmEntity)
        private readonly ormRepo: Repository<CitaOrmEntity>,
    ) {}

    async crear(cita: Cita): Promise<Cita> {
        const ormEntity = CitaMapper.toOrmEntity(cita);
        const savedOrmEntity = await this.ormRepo.save(ormEntity);
        return CitaMapper.toDomain(savedOrmEntity);
    }
}
