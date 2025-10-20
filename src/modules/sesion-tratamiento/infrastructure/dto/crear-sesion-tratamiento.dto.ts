import { IsString, IsUUID, IsNotEmpty, IsOptional, IsDateString, Matches } from 'class-validator';

export class CrearSesionTratamientoDto {
  @IsUUID()
  @IsNotEmpty()
  idTratamiento: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string; // "2025-10-20"

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe estar en formato HH:mm (ejemplo: 09:00)',
  })
  hora: string; // "09:00"

  @IsString()
  @IsOptional()
  observaciones?: string;
}