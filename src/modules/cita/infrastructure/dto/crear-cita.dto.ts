import { IsDateString, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CrearCitaDto {
  @IsUUID()
  @IsNotEmpty()
  idPaciente: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe estar en formato HH:mm (ejemplo: 14:30)',
  })
  hora: string;
}
