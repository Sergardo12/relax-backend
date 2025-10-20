import { IsOptional, IsUUID } from 'class-validator';

export class ListarColaboradoresDto {
  @IsOptional()
  @IsUUID()
  idEspecialidad?: string;
}
