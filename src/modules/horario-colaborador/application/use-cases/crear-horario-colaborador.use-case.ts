import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { HorarioColaborador } from '../../domain/entities/horario-colaborador.entity';
import { HorarioColaboradorRepository } from '../../domain/repositories/horario-colaborador.repository';
import { HORARIO_COLABORADOR_REPOSITORY_TOKEN } from '../../infrastructure/horario-colaborador.repository.token';
import { CrearHorarioColaboradorDto } from '../../infrastructure/dto/crear-horario-colaborador.dto';
import { HorarioColaboradorService } from '../services/horario-colaborador.service';
import { ColaboradorRepository } from 'src/modules/colaborador/domain/repositories/colaborador.repository';
import { COLABORADOR_REPOSITORY } from 'src/modules/colaborador/infrastructure/colaborador.repository.token';

@Injectable()
export class CrearHorarioColaboradorUseCase {
  constructor(
    @Inject(HORARIO_COLABORADOR_REPOSITORY_TOKEN)
    private readonly horarioColaboradorRepository: HorarioColaboradorRepository,
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
    private readonly horarioColaboradorService: HorarioColaboradorService,
  ) {}

  async ejecutar(
    dto: CrearHorarioColaboradorDto,
  ): Promise<Result<HorarioColaborador>> {
    console.log('='.repeat(50));
    console.log('🔍 CREAR HORARIO - DTO:', dto);
    console.log('='.repeat(50));
    // 1. Validar que el colaborador existe
    const colaboradorResult = await this.colaboradorRepository.findById(
      dto.idColaborador,
    );
    if (!colaboradorResult.ok) {
      return Result.failure(
        `Colaborador con ID ${dto.idColaborador} no encontrado`,
      );
    }

    // 2. Validar formato de horas
    const formatoInicioResult = this.horarioColaboradorService.validarFormatoHora(
      dto.horaInicio,
    );
    if (!formatoInicioResult.ok) {
      return Result.failure(formatoInicioResult.message);
    }

    const formatoFinResult = this.horarioColaboradorService.validarFormatoHora(
      dto.horaFin,
    );
    if (!formatoFinResult.ok) {
      return Result.failure(formatoFinResult.message);
    }

    // 3. Validar que horaFin > horaInicio
    const finMayorResult = this.horarioColaboradorService.validarHoraFinMayorQueInicio(
      dto.horaInicio,
      dto.horaFin,
    );
    if (!finMayorResult.ok) {
      return Result.failure(finMayorResult.message);
    }

    // 4. Validar horario laboral (08:00 - 22:30)
    const horarioLaboralResult = this.horarioColaboradorService.validarHorarioLaboral(
      dto.horaInicio,
      dto.horaFin,
    );
    if (!horarioLaboralResult.ok) {
      return Result.failure(horarioLaboralResult.message);
    }

    // 5. Validar que NO hay solapamiento
    const solapamientoResult = await this.horarioColaboradorService.validarSolapamiento(
      dto.idColaborador,
      dto.diaSemana,
      dto.horaInicio,
      dto.horaFin,
    );
    if (!solapamientoResult.ok) {
      return Result.failure(solapamientoResult.message);
    }

    // 6. Crear el horario
    const horario = new HorarioColaborador({
      colaborador: colaboradorResult.value,
      diaSemana: dto.diaSemana,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
    });

    return await this.horarioColaboradorRepository.create(horario);
  }
}
