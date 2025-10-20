import { IsUUID, IsNotEmpty } from 'class-validator';

export class PagarSuscripcionEfectivoDto {
  @IsUUID()
  @IsNotEmpty()
  idSuscripcion: string;
}