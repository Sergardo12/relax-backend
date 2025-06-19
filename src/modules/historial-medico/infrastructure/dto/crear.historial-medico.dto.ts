import { IsDateString, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CrearPacienteDto } from "../../../paciente/infrastructure/dto/crear-paciente.dto";
import { CrearCitaDto } from "../../../cita/infrastructure/dto/crear-cita.dto";
import { Paciente } from "../../../paciente/domain/entities/paciente.entity";

export class CrearHistorialMedicoDto {
  @IsDateString()
  @IsNotEmpty()
  fechaHistorial: Date;

  @ValidateNested()
  @Type(() => CrearPacienteDto)
  paciente: Paciente;

  @ValidateNested({ each: true })
  @Type(() => CrearCitaDto)
  citas: CrearCitaDto[];
}
