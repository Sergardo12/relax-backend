import { Usuario } from "../../../usuario/domain/entities/usuario.entity";

export class Paciente {
    constructor(
        public readonly id: number | null,
        public usuario: Usuario,
        public nombres: string,
        public apellidos: string,
        public dni : string,
        public edad: string,
        public telefono: string,
        public estadoPaciente: boolean
    ){}
}