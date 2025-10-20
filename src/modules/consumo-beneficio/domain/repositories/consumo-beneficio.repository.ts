import { Result } from 'src/common/types/result';
import { ConsumoBeneficio } from '../entities/consumo-beneficio.entity';

export interface ConsumoBeneficioRepository {
  create(consumo: ConsumoBeneficio): Promise<Result<ConsumoBeneficio>>;
  findAll(): Promise<Result<ConsumoBeneficio[]>>;
  findById(id: string): Promise<Result<ConsumoBeneficio>>;
  findBySuscripcionId(idSuscripcion: string): Promise<Result<ConsumoBeneficio[]>>;
  findByServicioAndSuscripcion(idServicio: string, idSuscripcion: string): Promise<Result<ConsumoBeneficio>>;
  update(id: string, consumo: ConsumoBeneficio): Promise<Result<ConsumoBeneficio>>;
  delete(id: string): Promise<Result<void>>;
}