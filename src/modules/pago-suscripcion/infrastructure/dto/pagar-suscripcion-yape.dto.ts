import { IsUUID, IsNotEmpty, IsEmail } from 'class-validator';

export class PagarSuscripcionYapeDto {
  @IsUUID()
  @IsNotEmpty()
  idSuscripcion: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}