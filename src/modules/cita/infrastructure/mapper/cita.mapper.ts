import { Cita } from '../../domain/entities/cita.entity';
import { CitaOrmEntity } from '../database/cita-entity.orm';
import { PacienteMapper } from '../../../paciente/infrastructure/mapper/paciente.mapper';
import { PacienteOrmEntity } from '../../../paciente/infrastructure/database/paciente.orm-entity';

export class CitaMapper {
  static toDomain(citaOrm: CitaOrmEntity): Cita {
    return new Cita({
      id: citaOrm.id,
      paciente: PacienteMapper.toDomain(citaOrm.paciente),
      fecha: citaOrm.fecha,
      hora: citaOrm.hora,
      estado: citaOrm.estado,
      estadoPago: citaOrm.estadoPago,
    });
  }

  static toOrmEntity(cita: Cita): CitaOrmEntity {
    const citaOrm = new CitaOrmEntity();
    citaOrm.id = cita.getId();

    // Relación con Paciente - solo asignamos el ID
    const pacienteOrm = new PacienteOrmEntity();
    pacienteOrm.id = cita.getPaciente().getId();
    citaOrm.paciente = pacienteOrm;

    citaOrm.fecha = cita.getFecha();
    citaOrm.hora = cita.getHora();
    citaOrm.estado = cita.getEstado();
    citaOrm.estadoPago = cita.getEstadoPago();

    return citaOrm;
  }
}
