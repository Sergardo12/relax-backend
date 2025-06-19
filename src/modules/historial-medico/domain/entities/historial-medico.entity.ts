import { Cita } from "../../../cita/domain/entities/cita.entity";
import { Paciente } from "../../../paciente/domain/entities/paciente.entity";

export class HistorialMedico{
    constructor(
        public readonly id: number | 0,
        public fechaHistorial: Date,
        public paciente: Paciente,
        public citas: Cita[]



    ){}
}