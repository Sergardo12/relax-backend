import { Usuario } from "../../../usuario/domain/entities/usuario.entity";

export class Colaborador {
    constructor(
        public readonly id: number | null,
        public usuario: Usuario,
        public nombres: string,
        public apellidos: string,
        public dni: string,
        public telefono: string,
        public fecha_contratacion: Date,
        public estadoColaborador: boolean,
    ) { }
}