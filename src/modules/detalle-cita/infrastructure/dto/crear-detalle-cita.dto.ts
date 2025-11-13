import { IsUUID, IsNotEmpty, IsNumber, IsOptional, Min, IsInt, IsBoolean, ValidateIf } from 'class-validator';

export class CrearDetalleCitaDto {
  @IsUUID()
  @IsNotEmpty()
  idCita: string;

  @IsUUID()
  @IsNotEmpty()
  idServicio: string;

  @IsUUID()
  @IsNotEmpty()
  idColaborador: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  cantidad?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precioUnitario?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  subtotal?: number;


  @IsBoolean()
  @IsOptional()
  pagarConMembresia?: boolean;


}