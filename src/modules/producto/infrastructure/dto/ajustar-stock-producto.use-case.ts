import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { OperacionStock, TipoAjuste } from "../../domain/enums/producto.enum";

export class AjustarStockProductoDto {
  @IsNumber()
  @Min(1)
  cantidad: number;
  
  @IsEnum(OperacionStock)
  operacion:OperacionStock

  @IsEnum(TipoAjuste)
  tipo: TipoAjuste;

  @IsString()
  @IsOptional()
  motivo?: string; // "Producto dañado en almacén"
}