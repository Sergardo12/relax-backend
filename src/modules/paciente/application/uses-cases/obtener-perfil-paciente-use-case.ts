import { Inject, Injectable } from "@nestjs/common";
import { PacienteRepository } from "../../domain/repositories/paciente.repository";
import { PACIENTE_REPOSITORY } from "../../infrastructure/paciente.repository.token";
import { Result } from "src/common/types/result";
import { Paciente } from "../../domain/entities/paciente.entity";

@Injectable()
export class ObtenerPerfilPaciente{ 
    constructor(
        @Inject(PACIENTE_REPOSITORY)
        private readonly pacienteRepository: PacienteRepository
    ){}

    async ejecutar (id: string): Promise<Result<Paciente>>{
        const result = await this.pacienteRepository.findByUsuarioId(id)

        if(!result.ok){
            return Result.failure("Usuario no encontrado")
        }


        return Result.success(result.value);
    }

    
}