import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class ActualizarTratamientoDto {
  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsString()
  @IsOptional()
  diagnostico?: string;

  @IsString()
  @IsOptional()
  tratamiento?: string;

  @IsString()
  @IsOptional()
  presionArterial?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  pulso?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  temperatura?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  peso?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  saturacion?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  sesionesTotales?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precioTotal?: number;
}