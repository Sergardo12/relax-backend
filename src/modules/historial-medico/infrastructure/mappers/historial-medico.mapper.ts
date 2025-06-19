import { HistorialMedico } from "../../domain/entities/historial-medico.entity";
import { HistorialMedicoOrmEntity } from "../database/historial.orm-entity";
import { PacienteMapper } from "../../../paciente/infrastructure/mappers/paciente.mapper";
import { CitaMapper } from "../../../cita/infrastructure/mappers/cita.mapper";

export class HistorialMedicoMapper {
  static toDomain(orm: HistorialMedicoOrmEntity): HistorialMedico {
    return new HistorialMedico(
      orm.id,
      orm.fechaHistorial,
      PacienteMapper.toDomain(orm.paciente),
      orm.citas ? orm.citas.map(cita => CitaMapper.toDomain(cita)) : []
    );
  }

  static toOrmEntity(domain: HistorialMedico): HistorialMedicoOrmEntity {
    const orm = new HistorialMedicoOrmEntity();
    orm.id = domain.id || 0;
    orm.fechaHistorial = domain.fechaHistorial;
    orm.paciente = PacienteMapper.toOrmEntity(domain.paciente);
    orm.citas = domain.citas? domain.citas.map(cita => CitaMapper.toOrmEntity(cita)): [];

    return orm;
  }
}
