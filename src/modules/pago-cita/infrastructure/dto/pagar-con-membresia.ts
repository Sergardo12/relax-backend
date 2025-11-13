import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PagarConMembresiaDto {
  @IsString()
  @IsNotEmpty()
  idCita: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}