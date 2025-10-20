import { EstadoEspecialidad } from "../enums/especialidad.enums";
import { v4 as uuidv4 } from "uuid";

export class Especialidad {
    public id: string;
    public nombre: string;
    public descripcion: string;
    public estado: EstadoEspecialidad;

    constructor({
        id = uuidv4(),
        nombre,
        descripcion,
        estado = EstadoEspecialidad.ACTIVO,
    }: {
        id?: string;
        nombre: string;
        descripcion: string;
        estado?: EstadoEspecialidad;
    }) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion
        this.estado = estado
    }
}