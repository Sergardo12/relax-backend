import { Cita } from "../../../cita/domain/entities/cita.entity";

export class PagoCita{
    constructor(
        public readonly id: number | 0,
        public monto: number,
        // public cita: Cita,
        public fechaPago: Date,
        public metodoPago: string
    ){}
}