import { IsNotEmpty, IsString } from "class-validator";

export class CrearRolDto {
    @IsString() 
    @IsNotEmpty() 
    nombreRol: string;

}
  