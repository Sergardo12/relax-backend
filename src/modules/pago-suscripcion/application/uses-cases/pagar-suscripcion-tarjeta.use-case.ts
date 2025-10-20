import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { PagoSuscripcion } from '../../domain/entities/pago-suscripcion.entity';
import { PagoSuscripcionRepository } from '../../domain/repositories/pago-suscripcion.repository';
import { PAGO_SUSCRIPCION_REPOSITORY_TOKEN } from '../../infrastructure/pago-suscripcion.repository.token';
import { SuscripcionRepository } from '../../../suscripcion/domain/repositories/suscripcion.repository';
import { SUSCRIPCION_REPOSITORY_TOKEN } from '../../../suscripcion/infrastructure/suscripcion.repository.token';
import { PagoSuscripcionService } from '../services/pago-suscripcion.service';
import { PagarSuscripcionTarjetaDto } from '../../infrastructure/dto/pagar-suscripcion-tarjeta.dto';
import { MetodoPagoSuscripcion, EstadoPagoSuscripcion } from '../../domain/enum/pago-suscripcion.enum';

@Injectable()
export class PagarSuscripcionTarjetaUseCase {
  constructor(
    @Inject(PAGO_SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly pagoRepository: PagoSuscripcionRepository,
    @Inject(SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly suscripcionRepository: SuscripcionRepository,
    private readonly pagoService: PagoSuscripcionService,
  ) {}

  async execute(dto: PagarSuscripcionTarjetaDto): Promise<Result<PagoSuscripcion>> {
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

      // 3. Validar monto
      const validacionMonto = this.pagoService.validarMonto(monto);
      if (!validacionMonto.ok) {
        return Result.failure(validacionMonto.message);
      }

      // 4. Crear registro de pago (pendiente)
      const pago = new PagoSuscripcion({
        suscripcion: suscripcion,
        culqiToken: dto.token,
        fechaPago: new Date(),
        metodoPago: MetodoPagoSuscripcion.TARJETA,
        montoTotal: monto,
        estado: EstadoPagoSuscripcion.PENDIENTE,
      });

      const pagoResult = await this.pagoRepository.create(pago);
      if (!pagoResult.ok) {
        return Result.failure('Error al crear el registro de pago');
      }

      // 5. Procesar pago con Culqi (API directa)
      const descripcion = `Membresía ${suscripcion.getMembresia().getNombre()} - ${suscripcion.getPaciente().getNombres()}`;
      
      const culqiResult = await this.pagoService.procesarPagoConTarjeta(
        dto.token,
        monto,
        dto.email,
        descripcion,
      );

      if (!culqiResult.ok) {
        // 6a. Marcar pago como fallido
        const pagoFallido = new PagoSuscripcion({
          id: pagoResult.value.getId(),
          suscripcion: suscripcion,
          culqiToken: dto.token,
          fechaPago: new Date(),
          metodoPago: MetodoPagoSuscripcion.TARJETA,
          montoTotal: monto,
          estado: EstadoPagoSuscripcion.FALLIDO,
          mensajeError: culqiResult.message,
          culqiResponse: culqiResult.error, // ← Guardar respuesta de error
        });

        await this.pagoRepository.update(pagoResult.value.getId(), pagoFallido);
        return Result.failure(culqiResult.message);
      }

      // 6b. Actualizar pago como exitoso
      const pagoExitoso = new PagoSuscripcion({
        id: pagoResult.value.getId(),
        suscripcion: suscripcion,
        culqiChargeId: culqiResult.value.id, // ← ID del charge en Culqi
        culqiToken: dto.token,
        fechaPago: new Date(),
        metodoPago: MetodoPagoSuscripcion.TARJETA,
        montoTotal: monto,
        estado: EstadoPagoSuscripcion.EXITOSO,
        culqiResponse: culqiResult.value, // ← Respuesta completa de Culqi
      });

      const pagoActualizadoResult = await this.pagoRepository.update(
        pagoResult.value.getId(),
        pagoExitoso,
      );

      if (!pagoActualizadoResult.ok) {
        return Result.failure('Error al actualizar el pago');
      }

      // 7. Activar la suscripción
      suscripcion.activar();
      const suscripcionActualizadaResult = await this.suscripcionRepository.update(
        suscripcion.getId(),
        suscripcion,
      );

      if (!suscripcionActualizadaResult.ok) {
        return Result.failure('Error al activar la suscripción');
      }

      console.log('✅ Suscripción activada exitosamente');
      return Result.success(pagoActualizadoResult.value);
    } catch (error) {
      console.error('Error en PagarSuscripcionTarjetaUseCase:', error);
      return Result.failure('Error al procesar el pago', error);
    }
  }
}