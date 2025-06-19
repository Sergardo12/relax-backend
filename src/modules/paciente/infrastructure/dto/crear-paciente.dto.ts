import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CrearPacienteDto{
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    usuario: number;

    @IsString()
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    dni: string;

    @IsString()
    @IsNotEmpty()
    edad: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

   
    

    


}