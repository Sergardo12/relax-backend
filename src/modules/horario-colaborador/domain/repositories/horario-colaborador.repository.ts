import { Result } from 'src/common/types/result';
import { HorarioColaborador } from '../entities/horario-colaborador.entity';
import { DiaSemana } from '../enums/dia-semana.enum';

export interface HorarioColaboradorRepository {
  create(horario: HorarioColaborador): Promise<Result<HorarioColaborador>>;
  findAll(): Promise<Result<HorarioColaborador[]>>;
  findById(id: string): Promise<Result<HorarioColaborador>>;
  findByColaboradorId(idColaborador: string): Promise<Result<HorarioColaborador[]>>;
  findByColaboradorAndDia(idColaborador: string,diaSemana: DiaSemana): Promise<Result<HorarioColaborador[]>>;
  update(id: string, horario: HorarioColaborador): Promise<Result<HorarioColaborador>>;
  delete(id: string): Promise<Result<void>>;
}
