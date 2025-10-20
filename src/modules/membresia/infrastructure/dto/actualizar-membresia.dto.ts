import { IsString, IsOptional, IsNumber, Min, IsInt } from 'class-validator';

export class ActualizarMembresiaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precio?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  duracionDias?: number;
}