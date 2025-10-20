import { IsString, IsOptional, IsDateString, Matches } from 'class-validator';

export class ActualizarSesionTratamientoDto {
  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe estar en formato HH:mm (ejemplo: 09:00)',
  })
  hora?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}