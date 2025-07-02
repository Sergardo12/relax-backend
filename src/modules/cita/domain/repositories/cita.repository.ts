import { Cita } from "../../../cita/domain/entities/cita.entity";

export interface CitaRepository {
    crear(usuario: Cita): Promise<Cita>;
    buscarPorId(id: number): Promise<Cita | null>;
}