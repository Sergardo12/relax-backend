import { IsString, IsUUID, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CrearTratamientoDto {
  @IsUUID()
  @IsOptional()
  idCita?: string;

  @IsUUID()
  @IsNotEmpty()
  idColaborador: string;

  @IsUUID()
  @IsNotEmpty()
  idPaciente: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string; // "2025-10-20"

  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @IsString()
  @IsNotEmpty()
  tratamiento: string;

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
  @IsNotEmpty()
  @Min(1)
  sesionesTotales: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precioTotal: number;
}