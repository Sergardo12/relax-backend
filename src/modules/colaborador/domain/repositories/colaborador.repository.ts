import { Colaborador } from "../entities/colaborador.entity";

export interface ColaboradorRepository {
    obtenerPorId(id: number): Promise<Colaborador | null>;
    // Puedes agregar más si necesitas buscar por DNI o email, etc.
}
