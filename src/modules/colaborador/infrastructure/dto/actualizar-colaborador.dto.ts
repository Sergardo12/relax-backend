import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';

export class ActualizarColaboradorDto {
  @IsOptional()
  @IsUUID()
  idEspecialidad?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  nombres?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  apellidos?: string;

  @IsOptional()
  @IsString()
  @Length(8, 8)
  @IsNumberString()
  dni?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsDateString()
  fechaContratacion?: string;

  @IsOptional()
  @IsString()
  @Length(9, 9)
  @IsNumberString()
  telefono?: string;
}
