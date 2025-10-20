import { IsOptional, IsString } from 'class-validator';

export class ActualizarObservacionesDto {
  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  @IsString()
  recomendaciones?: string;
}
