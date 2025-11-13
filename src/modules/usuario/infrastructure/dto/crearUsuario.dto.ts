import { IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";


export class CrearUsuarioDTO{
    
    @IsNotEmpty()
    @IsString()
    correo: string;

    @IsNotEmpty()
    @IsString()
    contraseña: string;

    @IsNotEmpty()
    @IsString()
    rolId: string;

    @IsNotEmpty()
    @IsString()
    estado: string;
}