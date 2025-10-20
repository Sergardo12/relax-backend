import { IsString, IsNotEmpty, IsEmail, IsUUID } from 'class-validator';

export class PagarSuscripcionTarjetaDto {
  @IsUUID()
  @IsNotEmpty()
  idSuscripcion: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string; // Token de Culqi
}