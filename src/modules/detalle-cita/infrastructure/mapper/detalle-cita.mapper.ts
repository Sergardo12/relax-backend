import { DetalleCita } from '../../domain/entities/detalle-cita.entity';
import { DetalleCitaOrmEntity } from '../database/detalle-cita-entity.orm';
import { CitaMapper } from 'src/modules/cita/infrastructure/mapper/cita.mapper';
import { ServicioMapper } from 'src/modules/servicio/infrastructure/mapper/servicio.mapper';
import { ColaboradorMapper } from 'src/modules/colaborador/infrastructure/mapper/colaborador.mapper';
import { CitaOrmEntity } from 'src/modules/cita/infrastructure/database/cita-entity.orm';
import { ServicioOrmEntity } from 'src/modules/servicio/infrastructure/database/servicio.orm-entity';
import { ColaboradorOrmEntity } from 'src/modules/colaborador/infrastructure/database/colaborador.orm-entity';
import { ConsumoBeneficioMapper } from 'src/modules/consumo-beneficio/infrastructure/mapper/consumo-beneficio.mapper';
import { ConsumoBeneficioOrmEntity } from 'src/modules/consumo-beneficio/infrastructure/database/consumo-beneficio.orm-entity';

export class DetalleCitaMapper {
  static toDomain(detalleCitaOrm: DetalleCitaOrmEntity): DetalleCita {
    return new DetalleCita({
      id: detalleCitaOrm.id,
      cita: CitaMapper.toDomain(detalleCitaOrm.cita),
      servicio: ServicioMapper.toDomain(detalleCitaOrm.servicio),
      colaborador: ColaboradorMapper.toDomain(detalleCitaOrm.colaborador),
      consumoBeneficio: detalleCitaOrm.consumoBeneficio ? ConsumoBeneficioMapper.toDomain(detalleCitaOrm.consumoBeneficio): undefined,
      precioUnitario: detalleCitaOrm.precioUnitario,
      cantidad: detalleCitaOrm.cantidad,
      subtotal: detalleCitaOrm.subtotal,
      esConMembresia: detalleCitaOrm.esConMembresia,
      observaciones: detalleCitaOrm.observaciones,
      diagnostico: detalleCitaOrm.diagnostico,
      recomendaciones: detalleCitaOrm.recomendaciones,
      fechaRegistro: detalleCitaOrm.fechaRegistro,
    });
  }

  static toOrmEntity(detalleCita: DetalleCita): DetalleCitaOrmEntity {
    const detalleCitaOrm = new DetalleCitaOrmEntity();
    detalleCitaOrm.id = detalleCita.getId();

    // Relaciones - solo asignamos IDs
    const citaOrm = new CitaOrmEntity();
    citaOrm.id = detalleCita.getCita().getId();
    detalleCitaOrm.cita = citaOrm;

    const servicioOrm = new ServicioOrmEntity();
    servicioOrm.id = detalleCita.getServicio().id;
    detalleCitaOrm.servicio = servicioOrm;

    const colaboradorOrm = new ColaboradorOrmEntity();
    colaboradorOrm.id = detalleCita.getColaborador().getId();
    detalleCitaOrm.colaborador = colaboradorOrm;

    const consumo = detalleCita.getConsumoBeneficio();
    if (consumo) {
      const consumoOrm = new ConsumoBeneficioOrmEntity();
      consumoOrm.id = consumo.getId();
      detalleCitaOrm.consumoBeneficio = consumoOrm;
    }

    detalleCitaOrm.precioUnitario = detalleCita.getPrecioUnitario();
    detalleCitaOrm.cantidad = detalleCita.getCantidad();
    detalleCitaOrm.subtotal = detalleCita.getSubtotal();
    detalleCitaOrm.esConMembresia = detalleCita.getEsConMembresia();
    detalleCitaOrm.observaciones = detalleCita.getObservaciones();
    detalleCitaOrm.diagnostico = detalleCita.getDiagnostico();
    detalleCitaOrm.recomendaciones = detalleCita.getRecomendaciones();
    detalleCitaOrm.fechaRegistro = detalleCita.getFechaRegistro();

    return detalleCitaOrm;
  }
}
