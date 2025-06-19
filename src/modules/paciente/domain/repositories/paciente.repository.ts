import { Paciente } from "../entities/paciente.entity";

export interface PacienteRepository {
    crear(paciente: Paciente): Promise<Paciente>;

    buscarPorId(id: number) : Promise<Paciente | null >;

    listarTodos(): Promise <Paciente[]>

    actualizar(paciente: Paciente): Promise<Paciente>;

    eliminar(id: number): Promise<void>;
}