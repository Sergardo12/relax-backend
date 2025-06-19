import { Inject, Injectable } from "@nestjs/common";
import { CrearHistorialMedicoDto } from "../../../historial-medico/infrastructure/dto/crear.historial-medico.dto";
import { HistorialMedicoRepository } from "../../../historial-medico/domain/repository/historial-medico.repository";
import { HISTORIAL_MEDICO_REPOSITORY } from "../../../historial-medico/historial-medico.repository.token"
import { HistorialMedico } from "../../domain/entities/historial-medico.entity";
import { PacienteMapper } from "../../../paciente/infrastructure/mappers/paciente.mapper";

@Injectable()
export class CrearHistorialMedicoUseCase {
  constructor(
    @Inject(HISTORIAL_MEDICO_REPOSITORY)
    private readonly historialRepo: HistorialMedicoRepository
  ) {}

  async execute(dto: CrearHistorialMedicoDto): Promise<HistorialMedico> {
    const historial = new HistorialMedico(
      0,
      dto.fechaHistorial,
      dto.paciente,
      []
    );

    return await this.historialRepo.crear(historial);
  }
}
