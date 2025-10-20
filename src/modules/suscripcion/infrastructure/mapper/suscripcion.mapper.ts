import { Suscripcion } from '../../domain/entities/suscripcion.entity';
import { SuscripcionOrmEntity } from '../database/suscripcion.orm-entity';
import { PacienteMapper } from '../../../paciente/infrastructure/mapper/paciente.mapper';
import { MembresiaMapper } from '../../../membresia/infrastructure/mapper/membresia.mapper';
import { PacienteOrmEntity } from '../../../paciente/infrastructure/database/paciente.orm-entity';
import { MembresiaOrmEntity } from '../../../membresia/infrastructure/database/membresia.orm-entity';

export class SuscripcionMapper {
  static toDomain(suscripcion: SuscripcionOrmEntity): Suscripcion {

    // TRAEME DE LA BD HACIA EL OBJETO
    return new Suscripcion({
      id: suscripcion.id,
      paciente: PacienteMapper.toDomain(suscripcion.paciente), 
      membresia: MembresiaMapper.toDomain(suscripcion.membresia),
      fechaInicio: suscripcion.fechaInicio,
      fechaFin: suscripcion.fechaFin,
      estado: suscripcion.estado,
    });
  }

  static toOrmEntity(suscripcion: Suscripcion): SuscripcionOrmEntity {

    // del objeto hacia la bd
    const suscripcionOrm = new SuscripcionOrmEntity();
    suscripcionOrm.id = suscripcion.getId();

    // Relación Paciente
    const pacienteOrm = new PacienteOrmEntity();
    pacienteOrm.id = suscripcion.getPaciente().getId(); // buscando la refernecia del paciente
    suscripcionOrm.paciente = pacienteOrm; // aqui esta asiganandole la referencia osea la fk

    // Relación Membresia
    const membresiaOrm = new MembresiaOrmEntity();
    membresiaOrm.id = suscripcion.getMembresia().getId();
    suscripcionOrm.membresia = membresiaOrm;

    suscripcionOrm.fechaInicio = suscripcion.getFechaInicio();
    suscripcionOrm.fechaFin = suscripcion.getFechaFin();
    suscripcionOrm.estado = suscripcion.getEstado();
    return suscripcionOrm;
  }
}