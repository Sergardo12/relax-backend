import { Rol } from "../entities/rol.entity";

export interface RolRepository {
    create(rol: Rol): Promise<Rol>;
    findById(id: string): Promise<Rol | null>;
    findAll(): Promise<Rol[]>;
    update(rol: Rol): Promise<Rol>;
    delete(id: string): Promise<boolean>;
    findByName(nombre: string): Promise<Rol | null>;
}