import { Servicio } from "../../../servicio/domain/entities/servicio.entity";

export interface ServicioRepository {
    crear(usuario: Servicio): Promise<Servicio>;
}