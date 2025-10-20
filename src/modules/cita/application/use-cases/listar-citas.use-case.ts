import { Inject, Injectable } from '@nestjs/common';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../infrastructure/cita.repository.token';
import { Cita } from '../../domain/entities/cita.entity';
import { Result } from '../../../../common/types/result';
import { ListarCitasDto } from '../../infrastructure/dto/listar-citas.dto';

@Injectable()
export class ListarCitasUseCase {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
  ) {}

  async ejecutar(query: ListarCitasDto): Promise<Result<Cita[]>> {
    // Convertir fecha string a Date si existe
    const fecha = query.fecha ? new Date(query.fecha) : undefined;

    // Si hay filtros específicos, aplicarlos
    if (query.idPaciente) {
      return await this.citaRepository.findByPacienteId(query.idPaciente);
    }

    if (fecha) {
      return await this.citaRepository.findByFecha(fecha);
    }

    if (query.estado) {
      return await this.citaRepository.findByEstado(query.estado);
    }

    // Sin filtros, devolver todas las citas
    return await this.citaRepository.findAll();
  }
}
