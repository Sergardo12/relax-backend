import { Especialidad } from 'src/modules/especialidad/domain/entities/especialidad.entity';
import { v4 as uuidv4 } from 'uuid';
import { EstadoServicio } from '../enum/servicio.enum';


export class Servicio{
    public id: string;
    public especialidad: Especialidad
    public nombre: string
    public descripcion: string;
    public precio: number
    public duracion: number;
    public estado: EstadoServicio

    constructor({
        id = uuidv4(),
        especialidad,
        nombre,
        descripcion,
        precio,
        duracion,
        estado = EstadoServicio.ACTIVO
    }:{
        id? : string
        especialidad: Especialidad
        nombre: string;
        descripcion: string;
        precio: number;
        duracion: number
        estado?: EstadoServicio
    }) {
        this.id = id;
        this.especialidad = especialidad;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.duracion = duracion;
        this.estado = estado
    }
    
}