import { InjectRepository } from "@nestjs/typeorm";
import { HistorialMedicoRepository } from "../../domain/repository/historial-medico.repository";
import { HistorialMedicoOrmEntity } from "../database/historial.orm-entity";
import { Repository } from "typeorm";
import { HistorialMedico } from "../../domain/entities/historial-medico.entity";
import { HistorialMedicoMapper } from "../mappers/historial-medico.mapper";


export class HistorialMedicoRepositoryImpl implements HistorialMedicoRepository{
    constructor(
        @InjectRepository(HistorialMedicoOrmEntity)
        private readonly historialRepo: Repository<HistorialMedicoOrmEntity>
    ){}

    async crear(historial: HistorialMedico): Promise<HistorialMedico>{
        const ormEntity = HistorialMedicoMapper.toOrmEntity(historial);
        const guardadoOrmEntity = await this.historialRepo.save(ormEntity)
        return HistorialMedicoMapper.toDomain(guardadoOrmEntity)
    }

    async obtenerHistorialPacienteId(paciente: number): Promise<HistorialMedico | null> {
        const historial = await this.historialRepo.findOne({
            where: { paciente: {id: paciente}},
            relations: ["paciente", "citas"]
        })
        return historial? HistorialMedicoMapper.toDomain(historial): null
    }
}