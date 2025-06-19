import { PagoCita } from "../../domain/entities/pago-cita.entity";
import { PagoCitaOrmEntity } from "../database/pago-cita.orm-entity";
import { CitaMapper } from "../../../cita/infrastructure/mappers/cita.mapper";
import { CitaOrmEntity } from "../../../cita/infrastructure/database/cita.orm-entity";

export class PagoCitaMapper {
  static toDomain(orm: PagoCitaOrmEntity): PagoCita {
    return new PagoCita(
      orm.id,
      orm.monto,
      // CitaMapper.toDomain(orm.cita), // mapeamos la cita relacionada
      orm.fechaPago,
      orm.metodoPago
    );
  }

  static toOrmEntity(domain: PagoCita): PagoCitaOrmEntity {
      const orm = new PagoCitaOrmEntity();
  orm.id = domain.id || 0;
  orm.monto = domain.monto;
  orm.fechaPago = domain.fechaPago;
  orm.metodoPago = domain.metodoPago;

  // // Creamos una instancia de CitaOrmEntity con solo el ID
  // const citaStub = new CitaOrmEntity();
  // citaStub.id = domain.cita.id || 0; // Aseguramos que el ID sea 0 si no está definido

  // // orm.cita = citaStub;

  return orm;
  }
}
