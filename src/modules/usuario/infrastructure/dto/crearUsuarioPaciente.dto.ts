import { IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";


export class CrearUsuarioPacienteDTO{
    
    @IsNotEmpty()
    @IsString()
    correo: string;

    @IsNotEmpty()
    @IsString()
    contraseña: string;

   
}