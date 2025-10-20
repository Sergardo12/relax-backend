import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class PagarConYapeDto {
  @IsUUID()
  @IsNotEmpty()
  idCita: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
