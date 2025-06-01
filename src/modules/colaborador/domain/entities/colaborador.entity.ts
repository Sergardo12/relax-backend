export class Colaborador {
    constructor(
        public readonly idColaborador: number | null,
        public dni: string,
        public nombres: string,
        public apellidos: string,
        public telefono: string,
        public email: string,
        public password_hash: string,
        public fecha_contratacion: Date,
        public estado: string,
        public tipo: string
    ) { }
}