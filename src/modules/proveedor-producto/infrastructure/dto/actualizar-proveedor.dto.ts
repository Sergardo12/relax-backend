import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { EstadoProveedorProducto } from '../../domain/enum/proveedor-producto.enum';



export class ActualizarProveedorDto {
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

  @IsEnum(EstadoProveedorProducto)
  @IsOptional()
  estado?: EstadoProveedorProducto;
}