import { Inject, Injectable } from "@nestjs/common";
import { TratamientoRepository } from "../../domain/repositories/tratamiento.repository";
import { TRATAMIENTO_REPOSITORY_TOKEN } from "../../infrastructure/tratamiento.repository.token";

@Injectable()
export class ListarTratamientosUseCase {
    constructor(
        @Inject(TRATAMIENTO_REPOSITORY_TOKEN)
        private readonly listarTratamientos: TratamientoRepository
    ){}

    async ejecutar(){
        return await this.listarTratamientos.findAll()
    }
}