import { Inject, Injectable } from "@nestjs/common";
import { ColaboradorRepository } from "../../domain/repositories/colaborador.repository";
import { COLABORADOR_REPOSITORY } from "../../infrastructure/colaborador.repository.token";
import { Result } from "src/common/types/result";
import { Colaborador } from "../../domain/entities/colaborador.entity";

@Injectable()
export class ObtenerPerfilColaboradorUseCase { 
    constructor(
        @Inject(COLABORADOR_REPOSITORY)
        private readonly colaboradorRepository: ColaboradorRepository
    ){}

    async ejecutar(id: string): Promise<Result<Colaborador>>{
        const result = await this.colaboradorRepository.findByUsuarioId(id);

        if(!result.ok){
            return Result.failure("Colaborador no encontrado");
        }

        return Result.success(result.value);
    }
}