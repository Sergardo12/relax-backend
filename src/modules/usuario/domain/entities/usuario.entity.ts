import { Rol } from "src/modules/rol/domain/entities/rol.entity";
import { EstadoUsuario } from "../enums/usuario.enum";
import { v4 as uuidv4 } from 'uuid';

export class Usuario {
    private id: string;
    public correo: string;
    private contraseña: string;
    private rol: Rol;
    private estado: EstadoUsuario;
    private perfilCompleto: boolean;

    constructor({
        id = uuidv4(),
        correo,
        contraseña,
        rol,
        estado = EstadoUsuario.ACTIVO,
        perfilCompleto = false,
    }: {
        id?: string; 
        correo: string;
        contraseña: string;
        rol: Rol;
        estado?: EstadoUsuario;
        perfilCompleto?: boolean;
    }) {
        this.id = id;
        this.correo = correo;
        this.contraseña = contraseña;
        this.rol = rol;
        this.estado = estado;
        this.perfilCompleto = perfilCompleto
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getContraseña(): string {
        return this.contraseña;
      }

     getEstado(): EstadoUsuario {
        return this.estado;
      }


      getRol(): Rol {
        return this.rol;
      }

      getPerfilCompleto(): boolean {
        return this.perfilCompleto;
    }

    
    completarPerfil(): void {
        this.perfilCompleto = true;
    }

    // Setters
    setCorreo(correo: string): void {
        if (!correo.trim()) throw new Error("El correo no puede estar vacío.");
        this.correo = correo;
    }


    // Método toJSON para serialización (sin incluir contraseña por seguridad)
    toJSON() {
        return {
            id: this.id,
            correo: this.correo,
            rol: this.rol.toJSON(),
            estado: this.estado,
            perfilCompleto: this.perfilCompleto,
        };
    }
}

