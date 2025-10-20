import { Result } from 'src/common/types/result';
import { Membresia } from '../entities/membresia.entity';

export interface MembresiaRepository {
  create(membresia: Membresia): Promise<Result<Membresia>>;
  findAll(): Promise<Result<Membresia[]>>;
  findById(id: string): Promise<Result<Membresia>>;
  findActivas(): Promise<Result<Membresia[]>>;
  update(id: string, membresia: Membresia): Promise<Result<Membresia>>;
  delete(id: string): Promise<Result<Membresia>>;
}