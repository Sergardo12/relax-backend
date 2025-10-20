import { IsInt, Min, IsOptional } from 'class-validator';

export class ActualizarBeneficioMembresiaDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  cantidad?: number;
}