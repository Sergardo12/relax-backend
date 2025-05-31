import { IsNotEmpty, IsString } from "class-validator";

export class CrearUsuarioDto {
    @IsString() // varchar
    @IsNotEmpty() //not null
    correo: string;

    @IsString()
    @IsNotEmpty()
    clave: string;
}
    

