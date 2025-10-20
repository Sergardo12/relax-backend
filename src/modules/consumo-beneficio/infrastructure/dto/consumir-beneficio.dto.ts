import { IsInt, Min, IsOptional } from 'class-validator';

export class ConsumirBeneficioDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  cantidad?: number; // Por defecto 1
}