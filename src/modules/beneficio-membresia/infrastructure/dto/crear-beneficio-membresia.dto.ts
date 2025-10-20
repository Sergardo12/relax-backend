import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CrearBeneficioMembresiaDto {
  @IsUUID()
  @IsNotEmpty()
  idMembresia: string;

  @IsUUID()
  @IsNotEmpty()
  idServicio: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  cantidad: number;
}