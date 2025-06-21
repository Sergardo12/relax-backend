import { Cita } from "../../domain/entities/cita.entity";
import { CitaOrmEntity } from "../database/cita.orm-entity";
import { PacienteMapper } from "../../../paciente/infrastructure/mappers/paciente.mapper";
import { ColaboradorMapper } from "../../../colaborador/infrastructure/mappers/colaborador.mapper";
import { ServicioMapper } from "../../../servicio/infrastructure/mappers/servicio.mapper";
import { HistorialMedicoMapper } from "../../../historial-medico/infrastructure/mappers/historial-medico.mapper";
import { PagoCitaMapper } from "../../../pago-cita/infrastructure/mappers/pago-cita.mapper";

export class CitaMapper {
  static toDomain(orm: CitaOrmEntity): Cita {
    return new Cita(
      orm.id,
      orm.fechaCita, // 2️⃣
      orm.horaCita, // 3️⃣
      orm.estadoCita, // 4️⃣  ✅ ESTÁ AQUÍ
      orm.motivoCita, // 5️⃣
      orm.diagnostico, // 6️⃣
      PacienteMapper.toDomain(orm.paciente), // 7️⃣
      ColaboradorMapper.toDomain(orm.colaborador), // 8️⃣
      orm.servicios?.map((servicio) => ServicioMapper.toDomain(servicio)) ?? [], // 9️⃣
      orm.historialMedico? HistorialMedicoMapper.toDomain(orm.historialMedico): null, // 🔟
      orm.pago ?? null, // 1️⃣1️⃣
    );
  }

static toOrmEntity(domain: Cita): CitaOrmEntity {
  const orm = new CitaOrmEntity();
  orm.id = domain.id ?? 0;
  orm.fechaCita = domain.fechaCita;
  orm.horaCita = domain.horaCita;
  orm.estadoCita = domain.estadoCita;
  orm.motivoCita = domain.motivoCita;
  orm.diagnostico = domain.diagnostico;
  orm.paciente = PacienteMapper.toOrmEntity(domain.paciente);
  orm.colaborador = ColaboradorMapper.toOrmEntity(domain.colaborador);
  orm.servicios = domain.servicios.map(ServicioMapper.toOrmEntity);
  if (domain.historialMedico) orm.historialMedico = HistorialMedicoMapper.toOrmEntity(domain.historialMedico);
  if (domain.pago) {
    const pagoOrm = PagoCitaMapper.toOrmEntity(domain.pago);
    orm.pago = pagoOrm;
  }
  return orm;
}

}
