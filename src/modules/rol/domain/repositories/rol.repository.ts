import { Rol } from "../entities/rol.entity";

export interface RolRepository {
    crear(rol: Rol) : Promise <Rol>;
}