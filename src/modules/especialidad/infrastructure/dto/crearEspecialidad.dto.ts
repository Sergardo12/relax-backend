import { IsNotEmpty, IsString } from "class-validator";

export class CrearEspecialidadDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

}