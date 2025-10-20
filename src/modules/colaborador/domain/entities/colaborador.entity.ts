import { Especialidad } from "src/modules/especialidad/domain/entities/especialidad.entity";
import { Usuario } from "src/modules/usuario/domain/entities/usuario.entity";
import { v4 as uuidv4 } from 'uuid';


export class Colaborador {
    private id: string;
    private usuario: Usuario;
    private especialidad: Especialidad;
    private nombres: string;
    private apellidos: string;
    private dni: string;
    private fechaNacimiento: Date;
    private fechaContratacion: Date;
    private telefono: string;


    constructor({
        id = uuidv4(),
        usuario,
        especialidad,
        nombres,
        apellidos,
        dni,
        fechaNacimiento,
        fechaContratacion,
        telefono,

    }: {
        id?: string;
        usuario: Usuario;
        especialidad: Especialidad;
        nombres: string;
        apellidos: string;
        dni: string;
        fechaNacimiento: Date;
        fechaContratacion: Date;
        telefono: string;

    }) {
        this.id = id;
        this.usuario = usuario;
        this.especialidad = especialidad;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.fechaContratacion = fechaContratacion;
        this.telefono = telefono;

    }

    // Getters
    getId(): string {
        return this.id;
    }

    getUsuario(): Usuario {
        return this.usuario;
    }

    getEspecialidad(): Especialidad {
        return this.especialidad;
    }

    getNombres(): string {
        return this.nombres;
    }

    getApellidos(): string {
        return this.apellidos;
    }

    getDni(): string {
        return this.dni;
    }

    getFechaNacimiento(): Date {
        return this.fechaNacimiento;
    }

    getFechaContratacion(): Date {
        return this.fechaContratacion;
    }

    getTelefono(): string {
        return this.telefono;
    }

    // Método toJSON para serialización
    toJSON() {
        return {
            id: this.id,
            usuario: this.usuario.toJSON(),
            especialidad: this.especialidad,
            nombres: this.nombres,
            apellidos: this.apellidos,
            dni: this.dni,
            fechaNacimiento: this.fechaNacimiento,
            fechaContratacion: this.fechaContratacion,
            telefono: this.telefono,
        };
    }
}
