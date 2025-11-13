import { 
  IsDateString, 
  IsEnum, 
  IsString, 
  IsOptional, 
  IsArray, 
  ValidateNested, 
  IsNumber, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoComprobanteVenta, MetodoPagoVenta } from '../../domain/enums/venta-producto.enum';

export class DetalleVentaDto {
  @IsString()
  idProducto: string;

  @IsNumber()
  @Min(1)
  cantidad: number;

}

export class CrearVentaProductoDto {
  @IsDateString()
  fecha: string;

  @IsEnum(TipoComprobanteVenta)
  tipoComprobante: TipoComprobanteVenta;


  @IsEnum(MetodoPagoVenta)
  metodoPago: MetodoPagoVenta;

  @IsNumber()
  @Min(0)
  @IsOptional()
  descuento?: number;

  @IsString()
  @IsOptional()
  clienteNombre?: string;

  @IsString()
  @IsOptional()
  clienteDocumento?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}