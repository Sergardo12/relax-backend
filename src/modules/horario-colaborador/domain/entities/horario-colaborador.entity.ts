import { v4 as uuidv4 } from 'uuid';
import { Colaborador } from 'src/modules/colaborador/domain/entities/colaborador.entity';
import { DiaSemana } from '../enums/dia-semana.enum';
import { EstadoHorarioColaborador } from '../enums/estado-horario-colaborador.enum';

export class HorarioColaborador {
  private id: string;
  private colaborador: Colaborador;
  private diaSemana: DiaSemana;
  private horaInicio: string;
  private horaFin: string;
  private estado: EstadoHorarioColaborador;

  constructor({
    id = uuidv4(),
    colaborador,
    diaSemana,
    horaInicio,
    horaFin,
    estado = EstadoHorarioColaborador.ACTIVO,
  }: {
    id?: string;
    colaborador: Colaborador;
    diaSemana: DiaSemana;
    horaInicio: string;
    horaFin: string;
    estado?: EstadoHorarioColaborador;
  }) {
    this.id = id;
    this.colaborador = colaborador;
    this.diaSemana = diaSemana;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.estado = estado;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getColaborador(): Colaborador {
    return this.colaborador;
  }

  getDiaSemana(): DiaSemana {
    return this.diaSemana;
  }

  getHoraInicio(): string {
    return this.horaInicio;
  }

  getHoraFin(): string {
    return this.horaFin;
  }

  getEstado(): EstadoHorarioColaborador {
    return this.estado;
  }

  // Método toJSON para serialización
  toJSON() {
    return {
      id: this.id,
      colaborador: {
        id: this.colaborador.getId(),
        nombres: this.colaborador.getNombres(),
        apellidos: this.colaborador.getApellidos(),
        especialidad: this.colaborador.getEspecialidad(),
      },
      diaSemana: this.diaSemana,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      estado: this.estado,
    };
  }
}
