import { IsString } from "@nestjs/class-validator";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CrearUsuarioColaboradorDto{

    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    contraseña: string
}