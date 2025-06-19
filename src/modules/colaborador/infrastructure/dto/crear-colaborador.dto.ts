import { IsDateString, IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CrearColaboradorDto {

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  usuario: number;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_contratacion: Date;

}
