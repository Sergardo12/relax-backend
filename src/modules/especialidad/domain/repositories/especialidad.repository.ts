import { Result } from "src/common/types/result";
import { Especialidad } from "../entities/especialidad.entity";

export interface EspecialidadRepository {
    create(especialidad: Especialidad): Promise<Result<Especialidad>>;
    findAll(): Promise<Result<Especialidad[]>>
    findById(id: string): Promise<Result<Especialidad>>
    findByName(nombre: string):Promise<Result<Especialidad> >
    update(id: string, nuevosDatos: Partial<Especialidad>): Promise<Result<Especialidad>>
    delete(id: string): Promise<Result<Especialidad>>

}