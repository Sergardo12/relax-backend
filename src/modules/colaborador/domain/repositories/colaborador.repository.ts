import { Colaborador } from "../entities/colaborador.entity";

export interface ColaboradorRepository {

  crear(colaborador: Colaborador): Promise<Colaborador>;

  buscarPorId(id: number): Promise<Colaborador | null>;

  listarTodos(): Promise<Colaborador[]>;

  actualizar(colaborador: Colaborador): Promise<Colaborador>;

  eliminar(id: number): Promise<void>;

 
}
