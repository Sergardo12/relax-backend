import { Inject, Injectable } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Cita } from '../../domain/entities/cita.entity';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../infrastructure/cita.repository.token';
import { PacienteRepository } from '../../../paciente/domain/repositories/paciente.repository';
import { PACIENTE_REPOSITORY } from '../../../paciente/infrastructure/paciente.repository.token';

@Injectable()
export class ListarMisCitasUseCase {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
  ) {}

  async ejecutar(usuarioId: string): Promise<Result<Cita[]>> {
    try {
      // 1. Buscar el paciente asociado al usuario
      const pacienteResult = await this.pacienteRepository.findByUsuarioId(usuarioId);
      
      if (!pacienteResult.ok) {
        return Result.failure('No se encontró el perfil del paciente');
      }

      const paciente = pacienteResult.value;

      // 2. Obtener las citas del paciente
      return await this.citaRepository.findByPacienteId(paciente.getId());
    } catch (error) {
      console.error('Error en ListarMisCitasUseCase:', error);
      return Result.failure('Error al obtener las citas', error);
    }
  }
}