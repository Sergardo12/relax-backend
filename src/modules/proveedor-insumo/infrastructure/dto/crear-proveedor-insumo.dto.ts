import { IsString, IsNotEmpty, IsOptional, Length, IsEmail } from 'class-validator';

export class CrearProveedorInsumoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  ruc: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}