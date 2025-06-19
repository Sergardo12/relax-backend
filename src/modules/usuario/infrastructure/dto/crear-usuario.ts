import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CrearUsuarioDto {
    @IsString() // varchar
    @IsNotEmpty() //not null
    correo: string;

    @IsString()
    @IsNotEmpty()
    clave: string;

    @IsInt() // 👈 Validamos que sea un número entero
    @IsNotEmpty()
    rolId: number; // 👈 Nuevo campo para relacionar con la tabla rol
}
    

