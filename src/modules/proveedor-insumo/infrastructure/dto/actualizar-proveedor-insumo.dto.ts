import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { EstadoProveedorInsumo } from '../../domain/enums/proveedor-insumo.enum';

export class ActualizarProveedorInsumoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsEnum(EstadoProveedorInsumo)
  @IsOptional()
  estado?: EstadoProveedorInsumo;
}