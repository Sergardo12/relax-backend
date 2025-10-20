import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PagarConTarjetaDto {
  @IsUUID()
  @IsNotEmpty()
  idCita: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
