import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class RolDto{

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;
}