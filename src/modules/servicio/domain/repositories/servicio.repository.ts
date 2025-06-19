import { Servicio } from "../../../servicio/domain/entities/servicio.entity";

export interface ServicioRepository {
    crear(servicio: Servicio): Promise<Servicio>;
    buscarPorId(id: number): Promise<Servicio | null>;

}