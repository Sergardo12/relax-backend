import { Result } from 'src/common/types/result';
import { BeneficioMembresia } from '../entities/beneficio-membresia.entity';

export interface BeneficioMembresiaRepository {
  create(beneficio: BeneficioMembresia): Promise<Result<BeneficioMembresia>>;
  findAll(): Promise<Result<BeneficioMembresia[]>>;
  findById(id: string): Promise<Result<BeneficioMembresia>>;
  findByMembresiaId(idMembresia: string): Promise<Result<BeneficioMembresia[]>>;
  update(id: string, beneficio: BeneficioMembresia): Promise<Result<BeneficioMembresia>>;
  delete(id: string): Promise<Result<void>>;
}