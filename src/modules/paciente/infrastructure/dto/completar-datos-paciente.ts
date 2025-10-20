import { IsDateString, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CrearPacienteDto{

    @IsString()
    @IsNotEmpty()
    usuarioId: string;

    @IsString()
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    dni: string;

    @IsDateString()
    @IsNotEmpty()
    fechaNacimiento: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

}