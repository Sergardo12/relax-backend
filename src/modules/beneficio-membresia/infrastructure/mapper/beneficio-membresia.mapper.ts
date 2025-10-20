import { BeneficioMembresia } from '../../domain/entities/beneficio-membresia.entity';
import { MembresiaMapper } from '../../../membresia/infrastructure/mapper/membresia.mapper';
import { ServicioMapper } from '../../../servicio/infrastructure/mapper/servicio.mapper';
import { MembresiaOrmEntity } from '../../../membresia/infrastructure/database/membresia.orm-entity';
import { ServicioOrmEntity } from '../../../servicio/infrastructure/database/servicio.orm-entity';
import { BeneficioMembresiaOrmEntity } from '../database/beneficio.membresia.orm-entity';

export class BeneficioMembresiaMapper {
  static toDomain(
    beneficioMembresia: BeneficioMembresiaOrmEntity,
  ): BeneficioMembresia {
    return new BeneficioMembresia({
      id: beneficioMembresia.id,
      membresia: MembresiaMapper.toDomain(beneficioMembresia.membresia),
      servicio: ServicioMapper.toDomain(beneficioMembresia.servicio),
      cantidad: beneficioMembresia.cantidad,
    });
  }

  static toOrmEntity(
    beneficioMembresia: BeneficioMembresia,
  ): BeneficioMembresiaOrmEntity {
    const beneficioMembresiaOrm = new BeneficioMembresiaOrmEntity();
    beneficioMembresiaOrm.id = beneficioMembresia.getId();

    // Relación Membresia
    const membresiaOrm = new MembresiaOrmEntity();
    membresiaOrm.id = beneficioMembresia.getMembresia().getId();
    beneficioMembresiaOrm.membresia = membresiaOrm;

    // Relación Servicio
    const servicioOrm = new ServicioOrmEntity();
    servicioOrm.id = beneficioMembresia.getServicio().id;
    beneficioMembresiaOrm.servicio = servicioOrm;

    beneficioMembresiaOrm.cantidad = beneficioMembresia.getCantidad();
    return beneficioMembresiaOrm;
  }
}
