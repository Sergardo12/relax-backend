import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsArray, Validate, ValidateNested } from "class-validator";
import { CrearPagoCitaDto } from "../../../pago-cita/infrastructure/dto/crear.pago-cita.dto";

export class CrearCitaDto {
  @IsDateString()
  @IsNotEmpty()
  fechaCita: Date;

  @IsString()
  @IsNotEmpty()
  horaCita: string;

  @IsString()
  @IsNotEmpty()
  motivoCita: string;

  @IsString()
  @IsOptional() // Diagnóstico puede estar vacío al crear la cita
  diagnostico?: string;

  @IsString()
  @IsNotEmpty()
  estadoCita: string;

  @IsInt()
  @IsNotEmpty()
  paciente: number;

  @IsInt()
  @IsNotEmpty()
  colaborador: number;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  servicios: number[];

  @ValidateNested()
  @Type(() => CrearPagoCitaDto)
  @IsOptional() 
  pago?: CrearPagoCitaDto;
}
