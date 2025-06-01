export class Cita {
    constructor (
        public readonly id: number | null,
        public fecha : Date,
        public hora : string,
        public estado : string,
    ) {}
}