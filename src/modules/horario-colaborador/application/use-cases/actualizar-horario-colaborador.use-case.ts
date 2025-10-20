import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { HorarioColaborador } from '../../domain/entities/horario-colaborador.entity';
import { HorarioColaboradorRepository } from '../../domain/repositories/horario-colaborador.repository';
import { HORARIO_COLABORADOR_REPOSITORY_TOKEN } from '../../infrastructure/horario-colaborador.repository.token';
import { ActualizarHorarioColaboradorDto } from '../../infrastructure/dto/actualizar-horario-colaborador.dto';
import { HorarioColaboradorService } from '../services/horario-colaborador.service';
import { ColaboradorRepository } from '../../../colaborador/domain/repositories/colaborador.repository';
import { COLABORADOR_REPOSITORY } from '../../../colaborador/infrastructure/colaborador.repository.token';

@Injectable()
export class ActualizarHorarioColaboradorUseCase {
  constructor(
    @Inject(HORARIO_COLABORADOR_REPOSITORY_TOKEN)
    private readonly horarioColaboradorRepository: HorarioColaboradorRepository,
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
    private readonly horarioColaboradorService: HorarioColaboradorService,
  ) {}

  async ejecutar(
    id: string,
    dto: ActualizarHorarioColaboradorDto,
  ): Promise<Result<HorarioColaborador>> {
    // 1. Validar que el horario existe
    const horarioExistenteResult = await this.horarioColaboradorRepository.findById(id);
    if (!horarioExistenteResult.ok) {
      return Result.failure(`Horario con ID ${id} no encontrado`);
    }

    const horarioExistente = horarioExistenteResult.value;

    // Determinar valores finales (usar nuevos valores o mantener existentes)
    const horaInicio = dto.horaInicio ?? horarioExistente.getHoraInicio();
    const horaFin = dto.horaFin ?? horarioExistente.getHoraFin();
    const diaSemana = dto.diaSemana ?? horarioExistente.getDiaSemana();
    const idColaborador = dto.idColaborador ?? horarioExistente.getColaborador().getId();

    // 2. Si se actualizan horas, validar formato
    if (dto.horaInicio) {
      const formatoResult = this.horarioColaboradorService.validarFormatoHora(dto.horaInicio);
      if (!formatoResult.ok) {
        return Result.failure(formatoResult.message);
      }
    }

    if (dto.horaFin) {
      const formatoResult = this.horarioColaboradorService.validarFormatoHora(dto.horaFin);
      if (!formatoResult.ok) {
        return Result.failure(formatoResult.message);
      }
    }

    // 3. Validar que horaFin > horaInicio
    const finMayorResult = this.horarioColaboradorService.validarHoraFinMayorQueInicio(
      horaInicio,
      horaFin,
    );
    if (!finMayorResult.ok) {
      return Result.failure(finMayorResult.message);
    }

    // 4. Validar horario laboral
    const horarioLaboralResult = this.horarioColaboradorService.validarHorarioLaboral(
      horaInicio,
      horaFin,
    );
    if (!horarioLaboralResult.ok) {
      return Result.failure(horarioLaboralResult.message);
    }

    // 5. Validar que NO hay solapamiento (excluyendo el horario actual)
    const solapamientoResult = await this.horarioColaboradorService.validarSolapamiento(
      idColaborador,
      diaSemana,
      horaInicio,
      horaFin,
      id, // Excluir el horario actual
    );
    if (!solapamientoResult.ok) {
      return Result.failure(solapamientoResult.message);
    }

    // 6. Si cambió el colaborador, validar que existe
    let colaborador = horarioExistente.getColaborador();
    if (dto.idColaborador && dto.idColaborador !== horarioExistente.getColaborador().getId()) {
      const colaboradorResult = await this.colaboradorRepository.findById(dto.idColaborador);
      if (!colaboradorResult.ok) {
        return Result.failure('Colaborador no encontrado');
      }
      colaborador = colaboradorResult.value;
    }

    // 7. Crear entidad actualizada
    const horarioActualizado = new HorarioColaborador({
      id: horarioExistente.getId(),
      colaborador: colaborador,
      diaSemana: diaSemana,
      horaInicio: horaInicio,
      horaFin: horaFin,
    });

    // 8. Actualizar
    return await this.horarioColaboradorRepository.update(id, horarioActualizado);
  }
}