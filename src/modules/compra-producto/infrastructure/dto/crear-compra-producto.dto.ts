import { IsUUID, IsDateString, IsEnum, IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoComprobanteCompraProducto } from '../../domain/enums/compra-producto.enum';

export class DetalleCompraDto {
  @IsUUID()
  idProducto: string;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precioCompra: number;
}

export class CrearCompraProductoDto {
  @IsUUID()
  idProveedor: string;

  @IsDateString()
  fecha: string;

  @IsEnum(TipoComprobanteCompraProducto)
  tipoComprobante: TipoComprobanteCompraProducto;

  @IsString()
  numeroComprobante: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleCompraDto)
  detalles: DetalleCompraDto[];
}