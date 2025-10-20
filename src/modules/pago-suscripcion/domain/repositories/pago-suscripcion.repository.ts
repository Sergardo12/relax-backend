import { Result } from 'src/common/types/result';
import { PagoSuscripcion } from '../entities/pago-suscripcion.entity';

export interface PagoSuscripcionRepository {
  create(pago: PagoSuscripcion): Promise<Result<PagoSuscripcion>>;
  findAll(): Promise<Result<PagoSuscripcion[]>>;
  findById(id: string): Promise<Result<PagoSuscripcion>>;
  findBySuscripcionId(idSuscripcion: string): Promise<Result<PagoSuscripcion[]>>;
  update(id: string, pago: PagoSuscripcion): Promise<Result<PagoSuscripcion>>;
}