import { IsString, IsOptional } from 'class-validator';

export class CompletarSesionDto {
  @IsString()
  @IsOptional()
  observaciones?: string;
}