import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class CrearServicioDto{

    @IsUUID()
    @IsNotEmpty()
    especialidadId: string

    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsNotEmpty()
    descripcion: string

    @IsNumber()
    @IsNotEmpty()
    precio: number

    @IsNumber()
    @IsNotEmpty()
    duracion: number



}