import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class PagarConEfectivoDto {
  @IsUUID()
  @IsNotEmpty()
  idCita: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
