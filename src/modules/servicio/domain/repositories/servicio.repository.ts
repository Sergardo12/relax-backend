import { Result } from "src/common/types/result";
import { Servicio } from "../entities/servicio.entity";

export interface ServicioRepository{
      create(servicio: Servicio): Promise<Result<Servicio>>;
      findAll(): Promise<Result<Servicio[]>>;
      findById(id: string): Promise<Result<Servicio>>;
      findByName(nombre: string): Promise<Result<Servicio>>
      update(id: string, nuevosDatos: Partial<Servicio>): Promise<Result<Servicio>>;
      delete(id: string): Promise<Result<Servicio>>;

}