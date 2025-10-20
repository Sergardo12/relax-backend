import { Tratamiento } from "src/modules/tratamiento/domain/entities/tratamiento.entity";
import { v4 as uuidv4 } from 'uuid';
import { EstadoSesion } from "../enum/sesion-tratamiento.enum";

export class SesionTratamiento {
    private id: string;
    private tratamiento: Tratamiento;
    private fecha: Date;
    private hora: string;
    private observaciones?: string;
    private estado: EstadoSesion; //por mejorar con enum

    constructor({
        id = uuidv4(),
        tratamiento,
        fecha,
        hora,
        observaciones,
        estado = EstadoSesion.PENDIENTE //por mejorar con enum
    }: {
        id?: string;
        tratamiento: Tratamiento;
        fecha: Date;
        hora: string;
        observaciones?: string;
        estado?: EstadoSesion; //por mejorar con enum
    }) {
        this.id = id;
        this.tratamiento = tratamiento;
        this.fecha = fecha;
        this.hora = hora;
        this.observaciones = observaciones;
        this.estado = estado;
    }
    // Getters y Setters
    public getId(): string {
        return this.id;
    }
    public getTratamiento(): Tratamiento {
        return this.tratamiento;
    }
    public getFecha(): Date {
        return this.fecha;
    }
    public getHora(): string {
        return this.hora;
    }
    public getObservaciones(): string | undefined {
        return this.observaciones;
    }
    public getEstado(): EstadoSesion {
        return this.estado;
    }

      // Métodos de negocio
    marcarComoRealizada(observaciones?: string): void {
        this.estado = EstadoSesion.REALIZADA;
        if (observaciones) {
            this.observaciones = observaciones;
        }
        // Incrementar contador en tratamiento
        this.tratamiento.incrementarSesionRealizada(this.fecha);
    }

    cancelar(): void {
        this.estado = EstadoSesion.CANCELADA;
    }

    toJSON() {
        return {
            id: this.id,
            tratamiento: { id: this.tratamiento.getId() },
            fecha: this.fecha,
            hora: this.hora,
            observaciones: this.observaciones ?? null,
            estado: this.estado
        };
    }

    

}