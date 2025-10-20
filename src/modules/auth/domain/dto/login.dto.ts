import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";


export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  contraseña: string;
}