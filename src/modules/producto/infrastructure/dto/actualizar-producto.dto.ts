import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { CategoriaProducto, EstadoProducto } from '../../domain/enums/producto.enum';

export class ActualizarProductoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioCosto?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precioVenta?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockMinimo?: number;

  @IsEnum(CategoriaProducto)
  @IsOptional()
  categoria?: CategoriaProducto;

  @IsEnum(EstadoProducto)
  @IsOptional()
  estado?: EstadoProducto;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsString()
  @IsOptional()
  lote?: string;
}
