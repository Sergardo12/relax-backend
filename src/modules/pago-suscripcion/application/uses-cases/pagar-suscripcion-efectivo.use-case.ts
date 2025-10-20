import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { PagoSuscripcion } from '../../domain/entities/pago-suscripcion.entity';
import { PagoSuscripcionRepository } from '../../domain/repositories/pago-suscripcion.repository';
import { PAGO_SUSCRIPCION_REPOSITORY_TOKEN } from '../../infrastructure/pago-suscripcion.repository.token';
import { SuscripcionRepository } from '../../../suscripcion/domain/repositories/suscripcion.repository';
import { SUSCRIPCION_REPOSITORY_TOKEN } from '../../../suscripcion/infrastructure/suscripcion.repository.token';
import { PagarSuscripcionEfectivoDto } from '../../infrastructure/dto/pagar-suscripcion-efectivo.dto';
import { MetodoPagoSuscripcion, EstadoPagoSuscripcion } from '../../domain/enum/pago-suscripcion.enum';

@Injectable()
export class PagarSuscripcionEfectivoUseCase {
  constructor(
    @Inject(PAGO_SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly pagoRepository: PagoSuscripcionRepository,
    @Inject(SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly suscripcionRepository: SuscripcionRepository,
  ) {}

  async execute(dto: PagarSuscripcionEfectivoDto): Promise<Result<PagoSuscripcion>> {
    try {
      // 1. Buscar la suscripción
      const suscripcionResult = await this.suscripcionRepository.findById(dto.idSuscripcion);
      if (!suscripcionResult.ok) {
        return Result.failure('Suscripción no encontrada');
      }

      const suscripcion = suscripcionResult.value;

      // 2. Validar que esté pendiente de pago
      if (suscripcion.getEstado() !== 'pendiente_pago') {
        return Result.failure('La suscripción no está pendiente de pago');
      }

      const monto = suscripcion.getMembresia().getPrecio();

      // 3. Crear registro de pago exitoso (efectivo)
      const pago = new PagoSuscripcion({
        suscripcion: suscripcion,
        fechaPago: new Date(),
        metodoPago: MetodoPagoSuscripcion.EFECTIVO,
        montoTotal: monto,
        estado: EstadoPagoSuscripcion.EXITOSO,
      });

      const pagoResult = await this.pagoRepository.create(pago);
      if (!pagoResult.ok) {
        return Result.failure('Error al registrar el pago');
      }

      // 4. Activar la suscripción
      suscripcion.activar();
      const suscripcionActualizadaResult = await this.suscripcionRepository.update(
        suscripcion.getId(),
        suscripcion,
      );

      if (!suscripcionActualizadaResult.ok) {
        return Result.failure('Error al activar la suscripción');
      }

      console.log('✅ Suscripción pagada en efectivo y activada');
      return Result.success(pagoResult.value);
    } catch (error) {
      console.error('Error en PagarSuscripcionEfectivoUseCase:', error);
      return Result.failure('Error al procesar el pago en efectivo', error);
    }
  }
}