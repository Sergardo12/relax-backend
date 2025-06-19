import { HistorialMedico } from "../entities/historial-medico.entity";

export interface HistorialMedicoRepository{
    crear(historial: HistorialMedico): Promise<HistorialMedico>;
    obtenerHistorialPacienteId(paciente: number): Promise<HistorialMedico | null>
}