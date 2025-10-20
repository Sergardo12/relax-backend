import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CompletarDatosColaboradorDto {

    @IsUUID()
    @IsNotEmpty()
    usuarioId: string;

    @IsUUID()
    @IsNotEmpty()
    especialidadId: string;

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
    fechaNacimiento: Date

    @IsDateString()
    @IsNotEmpty()
    fechaContratacion: Date

    @IsString()
    @IsNotEmpty()
    telefono: string


}