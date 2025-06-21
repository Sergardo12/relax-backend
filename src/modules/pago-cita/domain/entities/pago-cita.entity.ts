import { Cita } from "../../../cita/domain/entities/cita.entity";

export class PagoCita{
    constructor(
    public id: number,
    public monto: number,
    public fechaPago: Date,
    public metodoPago: string,
    public cita?: Cita // Se deja opcional en el constructor, pero se puede asignar luego
  ) {}
}