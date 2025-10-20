import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class ActualizarCitaDto {
  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe estar en formato HH:mm (ejemplo: 14:30)',
  })
  hora?: string;
}
