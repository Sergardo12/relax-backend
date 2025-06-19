import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CrearHistorialMedicoUseCase } from "../application/use-cases/crear.historial-medico.use-case";
import { HISTORIAL_MEDICO_REPOSITORY } from "../historial-medico.repository.token";
import { HistorialMedicoRepository } from "../domain/repository/historial-medico.repository";
import { CrearHistorialMedicoDto } from "./dto/crear.historial-medico.dto";
import { HistorialMedico } from "../domain/entities/historial-medico.entity";

@Controller('historial_medico')
export class HistorialMedicoController {
  constructor(
    private crearHistorialMedicoUseCase: CrearHistorialMedicoUseCase,
    @Inject(HISTORIAL_MEDICO_REPOSITORY)
    private readonly historialMedicoRepo: HistorialMedicoRepository,
  ) {}

  @Post()
  async crearHistorialMedico(
    @Body() dto: CrearHistorialMedicoDto,
  ): Promise<HistorialMedico> {
    return await this.crearHistorialMedicoUseCase.execute(dto);
  }

  @Get(':id')
  async obtenerHistorialMedicoPacienteId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HistorialMedico | null> {
    return await this.historialMedicoRepo.obtenerHistorialPacienteId(id);
  }
}