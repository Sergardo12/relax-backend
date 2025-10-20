import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';

export class CrearColaboradorDto {
  @IsUUID()
  @IsNotEmpty()
  idUsuario: string;

  @IsUUID()
  @IsNotEmpty()
  idEspecialidad: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombres: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @IsNumberString()
  dni: string;

  @IsDateString()
  @IsNotEmpty()
  fechaNacimiento: string;

  @IsDateString()
  @IsNotEmpty()
  fechaContratacion: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  @IsNumberString()
  telefono: string;
}
