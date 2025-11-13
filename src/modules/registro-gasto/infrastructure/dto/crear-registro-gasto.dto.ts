import { 
  IsUUID, 
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
import { TipoComprobanteGasto, CategoriaGasto } from '../../domain/enums/registro-gasto.enum';

export class DetalleGastoDto {
  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precioUnitario: number;
}

export class CrearRegistroGastoDto {
  @IsUUID()
  idProveedor: string;

  @IsDateString()
  fecha: string;

  @IsEnum(CategoriaGasto)
  categoria: CategoriaGasto;

  @IsEnum(TipoComprobanteGasto)
  tipoComprobante: TipoComprobanteGasto;

  @IsString()
  numeroComprobante: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleGastoDto)
  detalles: DetalleGastoDto[];
}