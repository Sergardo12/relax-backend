import { Result } from "../../../../common/types/result";
import { Paciente } from "../../domain/entities/paciente.entity";

export interface PacienteRepository {
  create(paciente: Paciente): Promise<Result<Paciente>>;
  findAll(): Promise<Result<Paciente[]>>;
  findById(id: string): Promise<Result<Paciente>>;
  findByName(nombre: string): Promise<Result<Paciente>>;
  findByDni(dni: string): Promise<Result<Paciente>>;
  findByUsuarioId(usuarioId: string): Promise<Result<Paciente>>;
  updateDatosPaciente(id: string, nuevosDatos: Paciente): Promise<Result<Paciente>>;
}
