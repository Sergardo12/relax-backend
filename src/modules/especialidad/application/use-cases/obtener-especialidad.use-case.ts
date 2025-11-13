import { InjectRepository } from "@nestjs/typeorm";
import { EspecialidadRepository } from "../../domain/repositories/especialidad.repository";
import { ESPECIALIDAD_REPOSITORY } from "../../infrastructure/especialidad.repository.token";
import { Inject, Injectable } from "@nestjs/common";
import { Result } from "src/common/types/result";
import { Especialidad } from "../../domain/entities/especialidad.entity";

@Injectable()
export class ObtenerEspecialidadPorId {
    constructor(
        @Inject(ESPECIALIDAD_REPOSITORY)
        private readonly obtenerEspecialidadPorId: EspecialidadRepository
    ){}

    async ejecutar(id: string): Promise<Result<Especialidad>>{
        console.log('Buscando la especidadlidad por su id: ', id)
        console.log('Especialidad: ', )
        const retult = await this.obtenerEspecialidadPorId.findById(id)
        console.log('Especiad', retult)
        return retult
        
    }
}