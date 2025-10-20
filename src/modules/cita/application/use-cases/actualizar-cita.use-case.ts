import { Inject, Injectable } from '@nestjs/common';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../infrastructure/cita.repository.token';
import { Cita } from '../../domain/entities/cita.entity';
import { CitaService } from '../services/cita.service';
import { Result } from '../../../../common/types/result';
import { ActualizarCitaDto } from '../../infrastructure/dto/actualizar-cita.dto';

@Injectable()
export class ActualizarCitaUseCase {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    private readonly citaService: CitaService,
  ) {}

  async ejecutar(id: string, dto: ActualizarCitaDto): Promise<Result<Cita>> {
    // Convertir fecha string a Date si existe
    const fecha = dto.fecha ? new Date(dto.fecha) : undefined;
    // Obtener la cita existente
    const citaResult = await this.citaRepository.findById(id);
    if (!citaResult.ok) {
      return Result.failure('Error al buscar la cita');
    }
    if (!citaResult.value) {
      return Result.failure('La cita no existe');
    }

    const citaExistente = citaResult.value;

    // Validar nueva fecha si se proporciona
    if (fecha && !this.citaService.validarFechaFutura(fecha)) {
      return Result.failure('La fecha de la cita debe ser futura');
    }

    // Validar nueva hora si se proporciona
    if (dto.hora && !this.citaService.validarHorarioLaboral(dto.hora)) {
      return Result.failure(
        'La hora debe estar dentro del horario laboral (8:00 AM - 8:00 PM)',
      );
    }

    // Crear cita actualizada
    const citaActualizada = new Cita({
      id: citaExistente.getId(),
      paciente: citaExistente.getPaciente(),
      fecha: fecha ?? citaExistente.getFecha(),
      hora: dto.hora ?? citaExistente.getHora(),
      estado: citaExistente.getEstado(),
      estadoPago: citaExistente.getEstadoPago(),
    });

    return await this.citaRepository.update(id, citaActualizada);
  }
}
