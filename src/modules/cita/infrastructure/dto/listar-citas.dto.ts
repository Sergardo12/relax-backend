import { IsOptional, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { CitaEstado } from '../../domain/enums/cita.enum';

export class ListarCitasDto {
  @IsOptional()
  @IsUUID()
  idPaciente?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsEnum(CitaEstado)
  estado?: CitaEstado;
}
