import { PagoCita } from "../entities/pago-cita.entity";

export interface PagoCitaRepository{
    crear(pagoCita: PagoCita): Promise<PagoCita>;
    obtenerPorId(id: number) : Promise<PagoCita | null>;
}