import { Inject } from "@nestjs/common";
import { ServicioRepository } from "../../domain/repositories/servicio.repository";
import { SERVICIO_REPOSITORY } from "../../infrastructure/servicio.repository.token";
import { Result } from "src/common/types/result";
import { Servicio } from "../../domain/entities/servicio.entity";

export class ObtenerServicioPorEspecialidadUseCase{
    constructor(
        @Inject(SERVICIO_REPOSITORY)
        private readonly servicioRepostory: ServicioRepository
    ){}

    async ejecutar(id: string): Promise<Result<Servicio[]>>{
        return await this.servicioRepostory.findByEspecialdad(id)
    }
}