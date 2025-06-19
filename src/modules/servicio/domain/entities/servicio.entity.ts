export class Servicio {
    constructor (
        public readonly id: number | null,
        public nombreServicio : string,
        public descripcionServicio : string,
        public precioServicio : string,
        public duracionServicio : string,
        public estadoServicio: boolean
    ) {}
}