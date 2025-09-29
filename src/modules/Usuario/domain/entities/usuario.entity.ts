import { Rol } from "src/modules/Rol/domain/entities/rol.entity";
import { EstadoUsuario } from "../enums/usuario.enum";
import { v4 as uuidv4 } from 'uuid';

export class Usuario {
    private id: string;
    public correo: string;
    private contraseña: string;
    private rol: Rol;
    private estado: EstadoUsuario;

    constructor({
        id = uuidv4(),
        correo,
        contraseña,
        rol,
        estado = EstadoUsuario.ACTIVO,
    }: {
        id?: string; // puede vernirse o no, espera qué? XD
        correo: string;
        contraseña: string;
        rol: Rol;
        estado?: EstadoUsuario;
    }) {
        this.id = id;
        this.correo = correo;
        this.contraseña = contraseña;
        this.rol = rol;
        this.estado = estado;
    }

    // Getters
    getId(): string {
        return this.id;
    }

     getEstado(): EstadoUsuario {
        return this.estado;
      }

      getRol(): Rol {
        return this.rol;
      }

    // Setters
    setCorreo(correo: string): void {
        if (!correo.trim()) throw new Error("El correo no puede estar vacío.");
        this.correo = correo;
    }

    
}

