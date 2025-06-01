export class Servicio {
    constructor (
        public readonly id: number | null,
        public nombreservicio : string,
        public descripcionservicio : string,
        public precioservicio : string,
        public duracion : string,
    ) {}
}