import { HistorialMedico } from "../../../historial-medico/domain/entities/historial-medico.entity";
import { Colaborador } from "../../../colaborador/domain/entities/colaborador.entity";
import { Paciente } from "../../../paciente/domain/entities/paciente.entity";
import { Servicio } from "../../../servicio/domain/entities/servicio.entity";
import { PagoCita } from "../../../pago-cita/domain/entities/pago-cita.entity";

export class Cita {
  constructor(
    public readonly id: number | null,
    public fechaCita?: Date,
    public horaCita?: string,
    public estadoCita?: string, // ← ESTE ES EL CUARTO
    public motivoCita?: string, // ← QUINTO
    public diagnostico?: string, // ← SEXTO
    
    public paciente?: Paciente,
    public colaborador?: Colaborador,
    public servicios?: Servicio[],
    public historialMedico?: HistorialMedico | null,
    public pago?: PagoCita | null,
  ) {}
}