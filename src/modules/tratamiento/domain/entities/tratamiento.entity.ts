import { Cita } from "src/modules/cita/domain/entities/cita.entity";
import { Colaborador } from "src/modules/colaborador/domain/entities/colaborador.entity";
import { Paciente } from "src/modules/paciente/domain/entities/paciente.entity";
import { v4 as uuidv4 } from 'uuid';
import { EstadoTratamiento } from "../enum/tratamiento.enum";

export class Tratamiento {
    private id: string;
    private cita?: Cita;
    private colaborador: Colaborador;
    private paciente: Paciente;
    private fechaInicio: Date;
    private diagnostico: string;
    private tratamiento: string;
    private presionArterial?: string;
    private pulso?: number;
    private temperatura?: number;
    private peso?: number;
    private saturacion?: number;
    private sesionesTotales: number;
    private sesionesRealizadas: number;
    private fechaFin?: Date;
    private precioTotal: number;
    private estado: EstadoTratamiento;

    constructor({
        id= uuidv4(),
        cita,
        colaborador,
        paciente,
        fechaInicio,
        diagnostico,
        tratamiento,
        presionArterial,
        pulso,
        temperatura,
        peso,
        saturacion,
        sesionesTotales,
        sesionesRealizadas = 0,
        fechaFin,
        precioTotal,
        estado=EstadoTratamiento.ACTIVO
    }: {
        id?: string;
        cita?: Cita;
        colaborador: Colaborador;
        paciente: Paciente;
        fechaInicio: Date;
        diagnostico: string;
        tratamiento: string;
        presionArterial?: string;
        pulso?: number;
        temperatura?: number;
        peso?: number;
        saturacion?: number;
        sesionesTotales: number;
        sesionesRealizadas?: number;
        fechaFin?: Date;
        precioTotal: number;
        estado?: EstadoTratamiento;
    }){
       this.id = id;
       this.cita = cita;
       this.colaborador = colaborador;
       this.paciente = paciente;
       this.fechaInicio = fechaInicio;
       this.diagnostico = diagnostico;
       this.tratamiento = tratamiento;
       this.presionArterial = presionArterial;
       this.pulso = pulso;
       this.temperatura = temperatura;
       this.peso = peso;
       this.saturacion = saturacion;
       this.sesionesTotales = sesionesTotales;
       this.sesionesRealizadas = sesionesRealizadas;
       this.fechaFin = fechaFin;
       this.precioTotal = precioTotal;
       this.estado = estado;
    }

    // Getters
    getId(): string {
        return this.id;
    }
    getCita(): Cita | undefined {
        return this.cita;
    }
    getColaborador(): Colaborador {
        return this.colaborador;
    }
    getPaciente(): Paciente {
        return this.paciente;
    }
    getFechaInicio(): Date {
        return this.fechaInicio;
    }
    getDiagnostico(): string {
        return this.diagnostico;
    }
    getTratamiento(): string {
        return this.tratamiento;
    }
    getPresionArterial(): string | undefined {
        return this.presionArterial;
    }
    getPulso(): number | undefined {
        return this.pulso;
    }
    getTemperatura(): number | undefined {
        return this.temperatura;
    }
    getPeso(): number | undefined {
        return this.peso;
    }
    getSaturacion(): number | undefined {
        return this.saturacion;
    }
    getSesionesTotales(): number {
        return this.sesionesTotales;
    }
    getSesionesRealizadas(): number {
        return this.sesionesRealizadas;
    }
    getFechaFin(): Date | undefined {
        return this.fechaFin;
    }
    getPrecioTotal(): number {
        return this.precioTotal;
    }
    getEstado(): EstadoTratamiento {
        return this.estado;
    }

    incrementarSesionRealizada(fechaSesion?: Date ): void {
  if (this.sesionesRealizadas < this.sesionesTotales) {
    this.sesionesRealizadas++;
    console.log('Sesiones:', this.sesionesRealizadas, '/', this.sesionesTotales)

            // Si completó todas las sesiones
    if (this.sesionesRealizadas === this.sesionesTotales) {
      console.log("Conpletando tratamiento...")
      this.completar(fechaSesion)
      console.log("Estado despues: ", this.estado);
      console.log("Fecha fin despues", this.fechaFin)
    }
  }
}

    completar(fechaSesion?: Date): void {
        this.estado = EstadoTratamiento.COMPLETADO;
        this.fechaFin = fechaSesion || new Date();
        console.log("Tratamiento completado, Fecha fin: ", this.fechaFin)
    }

    cancelar(): void {
        this.estado = EstadoTratamiento.CANCELADO;
        this.fechaFin = new Date();
    }
    // Método toJSON para serialización 
    toJSON() {
        return {
            id: this.id,
            cita:  this.cita ? {
                    id: this.cita.getId(),
                } :
                null,
            colaborador: { 
                id: this.colaborador.getId(),
                nombre: this.colaborador.getNombres(), 
                apellido: this.colaborador.getApellidos()
             },
            paciente: { 
                id: this.paciente.getId() , 
                nombre: this.paciente.getNombres(), 
                apellido: this.paciente.getApellidos() 
            },  
            fechaInicio: this.fechaInicio,
            diagnostico: this.diagnostico,
            tratamiento: this.tratamiento,
            presionArterial: this.presionArterial ?? null,
            pulso: this.pulso ?? null,
            temperatura: this.temperatura ?? null,
            peso: this.peso ?? null,
            saturacion: this.saturacion ?? null,
            sesionesTotales: this.sesionesTotales,
            sesionesRealizadas: this.sesionesRealizadas,
            fechaFin: this.fechaFin ?? null,
            precioTotal: this.precioTotal,
            estado: this.estado
        };
    }

    

    
}