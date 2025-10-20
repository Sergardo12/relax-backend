import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../infrastructure/cita.repository.token';
import { PACIENTE_REPOSITORY } from '../../../paciente/infrastructure/paciente.repository.token';
import { PacienteRepository } from '../../../paciente/domain/repositories/paciente.repository';
import { Cita } from '../../domain/entities/cita.entity';
import { CitaEstado, EstadoPago } from '../../domain/enums/cita.enum';
import { CitaService } from '../services/cita.service';
import { Result } from '../../../../common/types/result';
import { CrearCitaDto } from '../../infrastructure/dto/crear-cita.dto';

@Injectable()
export class CrearCitaUseCase {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
    private readonly citaService: CitaService,
  ) {}

  async ejecutar(dto: CrearCitaDto): Promise<Result<Cita>> {
    const { idPaciente, fecha: fechaString, hora } = dto;
    const fecha = new Date(fechaString);
    // Validar que el paciente exista
    const pacienteResult = await this.pacienteRepository.findById(idPaciente);
    if (!pacienteResult.ok) {
      return Result.failure('Error al buscar el paciente');
    }
    if (!pacienteResult.value) {
      return Result.failure('El paciente especificado no existe');
    }

    // Validar fecha futura
    if (!this.citaService.validarFechaFutura(fecha)) {
      return Result.failure('La fecha de la cita debe ser futura');
    }

    // Validar horario laboral
    if (!this.citaService.validarHorarioLaboral(hora)) {
      return Result.failure(
        'La hora debe estar dentro del horario laboral (8:00 AM - 8:00 PM)',
      );
    }

    // Crear la cita
    const nuevaCita = new Cita({
      paciente: pacienteResult.value,
      fecha,
      hora,
      estado: CitaEstado.PENDIENTE,
      estadoPago: EstadoPago.PENDIENTE,
    });

    // Guardar en el repositorio
    return await this.citaRepository.create(nuevaCita);
  }
}
