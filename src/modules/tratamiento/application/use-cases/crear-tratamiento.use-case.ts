import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { Tratamiento } from '../../domain/entities/tratamiento.entity';
import { TratamientoRepository } from '../../domain/repositories/tratamiento.repository';
import { TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/tratamiento.repository.token';
import { CrearTratamientoDto } from '../../infrastructure/dto/crear-tratamiento.dto';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../../cita/infrastructure/cita.repository.token';
import { ColaboradorRepository } from '../../../colaborador/domain/repositories/colaborador.repository';
import { COLABORADOR_REPOSITORY } from '../../../colaborador/infrastructure/colaborador.repository.token';
import { PacienteRepository } from '../../../paciente/domain/repositories/paciente.repository';
import { PACIENTE_REPOSITORY } from '../../../paciente/infrastructure/paciente.repository.token';
import { Cita } from 'src/modules/cita/domain/entities/cita.entity';

@Injectable()
export class CrearTratamientoUseCase {
  constructor(
    @Inject(TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly tratamientoRepository: TratamientoRepository,
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
  ) {}

  async execute(dto: CrearTratamientoDto): Promise<Result<Tratamiento>> {
    try {
      // 1. Validar colaborador
      const colaboradorResult = await this.colaboradorRepository.findById(dto.idColaborador);
      if (!colaboradorResult.ok) {
        return Result.failure('Colaborador no encontrado');
      }
      const colaborador = colaboradorResult.value;

      // 2. Validar paciente
      const pacienteResult = await this.pacienteRepository.findById(dto.idPaciente);
      if (!pacienteResult.ok) {
        return Result.failure('Paciente no encontrado');
      }
      const paciente = pacienteResult.value;

      // 3. Validar cita (opcional)
      let cita: Cita | undefined = undefined; // empieza por undefined
      if (dto.idCita) {
        const citaResult = await this.citaRepository.findById(dto.idCita);
        if (!citaResult.ok) {
          return Result.failure('Cita no encontrada');
        }
        cita = citaResult.value ?? undefined; // se reasigna
      }
      const fechaInicio = new Date(dto.fechaInicio + 'T12:00:00')

      // 4. Crear entidad de dominio
      const tratamiento = new Tratamiento({
        cita,
        colaborador,
        paciente,
        fechaInicio: fechaInicio,
        diagnostico: dto.diagnostico,
        tratamiento: dto.tratamiento,
        presionArterial: dto.presionArterial,
        pulso: dto.pulso,
        temperatura: dto.temperatura,
        peso: dto.peso,
        saturacion: dto.saturacion,
        sesionesTotales: dto.sesionesTotales,
        sesionesRealizadas: 0,
        precioTotal: dto.precioTotal,
      });

      // 5. Guardar en BD
      return await this.tratamientoRepository.create(tratamiento);
    } catch (error) {
      console.error('Error en CrearTratamientoUseCase:', error);
      return Result.failure('Error al crear el tratamiento', error);
    }
  }
}