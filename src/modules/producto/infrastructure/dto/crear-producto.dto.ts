import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min, IsNotEmpty } from 'class-validator';
import { CategoriaProducto } from '../../domain/enums/producto.enum';

export class CrearProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  precioCosto: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  precioVenta: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stockMinimo: number;

  @IsEnum(CategoriaProducto)
  @IsNotEmpty()
  categoria: CategoriaProducto;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsString()
  @IsOptional()
  lote?: string;
}