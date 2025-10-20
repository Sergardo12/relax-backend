import { IsString, IsNotEmpty, IsNumber, Min, IsInt } from 'class-validator';

export class CrearMembresiaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precio: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  duracionDias: number;
}