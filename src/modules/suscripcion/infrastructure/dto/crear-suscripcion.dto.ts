import { IsUUID, IsNotEmpty } from 'class-validator';

export class CrearSuscripcionDto {
  @IsUUID()
  @IsNotEmpty()
  idPaciente: string;

  @IsUUID()
  @IsNotEmpty()
  idMembresia: string;
}