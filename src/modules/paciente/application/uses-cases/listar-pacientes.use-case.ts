import { Result } from "src/common/types/result";
import { PacienteRepository } from "../../domain/repositories/paciente.repository";
import { PACIENTE_REPOSITORY } from "../../infrastructure/paciente.repository.token";
import { Inject, Injectable } from "@nestjs/common";
import { Paciente } from "../../domain/entities/paciente.entity";

@Injectable()
export class ListarPacientesUseCase{
    constructor(
        @Inject(PACIENTE_REPOSITORY)
        private readonly pacienteRepository: PacienteRepository
    ){}

    async ejecutar(): Promise<Result<Paciente[]>>{
        return await this.pacienteRepository.findAll();
    }
}