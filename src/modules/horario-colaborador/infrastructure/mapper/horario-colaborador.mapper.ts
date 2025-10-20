import { HorarioColaborador } from '../../domain/entities/horario-colaborador.entity';
import { HorarioColaboradorOrmEntity } from '../database/horario-colaborador-entity.orm';
import { ColaboradorMapper } from 'src/modules/colaborador/infrastructure/mapper/colaborador.mapper';
import { ColaboradorOrmEntity } from 'src/modules/colaborador/infrastructure/database/colaborador.orm-entity';

export class HorarioColaboradorMapper {
  /**
   * Convierte de ORM entity a Domain entity
   */
  static toDomain(
    horarioColaboradorOrm: HorarioColaboradorOrmEntity,
  ): HorarioColaborador {
    return new HorarioColaborador({
      id: horarioColaboradorOrm.id,
      colaborador: ColaboradorMapper.toDomain(horarioColaboradorOrm.colaborador),
      diaSemana: horarioColaboradorOrm.diaSemana,
      horaInicio: horarioColaboradorOrm.horaInicio,
      horaFin: horarioColaboradorOrm.horaFin,
      estado: horarioColaboradorOrm.estado,
    });
  }

  /**
   * Convierte de Domain entity a ORM entity
   */
  static toOrmEntity(
    horarioColaborador: HorarioColaborador,
  ): HorarioColaboradorOrmEntity {
    const horarioColaboradorOrm = new HorarioColaboradorOrmEntity();
    horarioColaboradorOrm.id = horarioColaborador.getId();

    // Crear ColaboradorOrmEntity solo con ID
    const colaboradorOrm = new ColaboradorOrmEntity();
    colaboradorOrm.id = horarioColaborador.getColaborador().getId();
    horarioColaboradorOrm.colaborador = colaboradorOrm;

    horarioColaboradorOrm.diaSemana = horarioColaborador.getDiaSemana();
    horarioColaboradorOrm.horaInicio = horarioColaborador.getHoraInicio();
    horarioColaboradorOrm.horaFin = horarioColaborador.getHoraFin();
    horarioColaboradorOrm.estado = horarioColaborador.getEstado();

    return horarioColaboradorOrm;
  }
}
