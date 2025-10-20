import { IsEnum, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { DiaSemana } from '../../domain/enums/dia-semana.enum';

export class CrearHorarioColaboradorDto {
  @IsNotEmpty()
  @IsUUID()
  idColaborador: string;

  @IsNotEmpty()
  @IsEnum(DiaSemana)
  diaSemana: DiaSemana;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaInicio debe tener formato HH:mm',
  })
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaFin debe tener formato HH:mm',
  })
  horaFin: string;
}
