import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { DiaSemana } from '../../domain/enums/dia-semana.enum';
import { EstadoHorarioColaborador } from '../../domain/enums/estado-horario-colaborador.enum';

export class ActualizarHorarioColaboradorDto {
  @IsOptional()
  @IsUUID()
  idColaborador?: string;

  @IsOptional()
  @IsEnum(DiaSemana)
  diaSemana?: DiaSemana;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaInicio debe tener formato HH:mm',
  })
  horaInicio?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaFin debe tener formato HH:mm',
  })
  horaFin?: string;

  @IsOptional()
  @IsEnum(EstadoHorarioColaborador)
  estado?: EstadoHorarioColaborador;
}
