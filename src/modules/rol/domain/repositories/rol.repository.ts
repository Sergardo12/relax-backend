import { Rol } from "../entities/rol.entity";

export interface RolRepository {
    crear(rol: Rol) : Promise <Rol>;
    obtenerPorId(id: number): Promise<Rol | null>; // 👈 Agregado
}