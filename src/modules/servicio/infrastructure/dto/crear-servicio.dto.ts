import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CrearServicioDto {
  @IsString()
  @IsNotEmpty()
  nombreServicio: string;

  @IsString()
  @IsNotEmpty()
  descripcionServicio: string;

  @IsString()
  @IsNotEmpty()
  precioServicio: string;

  @IsString()
  @IsNotEmpty()
  duracionServicio: string;

  @IsBoolean()
  @IsNotEmpty()
  estadoServicio: boolean;
}
