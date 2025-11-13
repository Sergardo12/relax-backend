import { Result } from "src/common/types/result";
import { Especialidad } from "../../domain/entities/especialidad.entity";
import { EspecialidadRepository } from "../../domain/repositories/especialidad.repository";
import { Inject } from "@nestjs/common";
import { ESPECIALIDAD_REPOSITORY } from "../../infrastructure/especialidad.repository.token";

export class ListarEspecialidadesUseCase {
    constructor(
        @Inject(ESPECIALIDAD_REPOSITORY)
        private readonly especialidadRepository: EspecialidadRepository,
    ){}

    async ejecutar(): Promise<Result<Especialidad[]>>{
        return await this.especialidadRepository.findAll()
    }
}