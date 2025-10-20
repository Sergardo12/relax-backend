import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { PagoSuscripcion } from '../../domain/entities/pago-suscripcion.entity';
import { PagoSuscripcionRepository } from '../../domain/repositories/pago-suscripcion.repository';
import { PAGO_SUSCRIPCION_REPOSITORY_TOKEN } from '../../infrastructure/pago-suscripcion.repository.token';
import { SuscripcionRepository } from '../../../suscripcion/domain/repositories/suscripcion.repository';
import { SUSCRIPCION_REPOSITORY_TOKEN } from '../../../suscripcion/infrastructure/suscripcion.repository.token';
import { PagoSuscripcionService } from '../services/pago-suscripcion.service';
import { PagarSuscripcionYapeDto } from '../../infrastructure/dto/pagar-suscripcion-yape.dto';
import { MetodoPagoSuscripcion, EstadoPagoSuscripcion } from '../../domain/enum/pago-suscripcion.enum';

@Injectable()
export class PagarSuscripcionYapeUseCase {
  constructor(
    @Inject(PAGO_SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly pagoRepository: PagoSuscripcionRepository,
    @Inject(SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly suscripcionRepository: SuscripcionRepository,
    private readonly pagoService: PagoSuscripcionService,
  ) {}

  async execute(dto: PagarSuscripcionYapeDto): Promise<Result<PagoSuscripcion>> {
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

      // 4. Crear orden de Yape en Culqi
      const descripcion = `Membresía ${suscripcion.getMembresia().getNombre()} - ${suscripcion.getPaciente().getNombres()}`;
      
      const yapeResult = await this.pagoService.procesarPagoConYape(
        monto,
        dto.email,
        descripcion,
        dto.idSuscripcion, // orderNumber
      );

      if (!yapeResult.ok) {
        return Result.failure(yapeResult.message);
      }

      // 5. Crear registro de pago pendiente con QR
      const pago = new PagoSuscripcion({
        suscripcion: suscripcion,
        fechaPago: new Date(),
        metodoPago: MetodoPagoSuscripcion.YAPE,
        montoTotal: monto,
        estado: EstadoPagoSuscripcion.PENDIENTE,
        culqiResponse: yapeResult.value,
        qrUrl: yapeResult.value.qr_code || yapeResult.value.payment_code,
        paymentUrl: yapeResult.value.payment_code,
      });

      const pagoResult = await this.pagoRepository.create(pago);
      if (!pagoResult.ok) {
        return Result.failure('Error al crear el registro de pago');
      }

      console.log('✅ Orden Yape creada. Cliente debe escanear QR para completar el pago');
      
      // 6. Devolver el PagoSuscripcion creado (contiene qrUrl y paymentUrl)
      return Result.success(pagoResult.value);
    } catch (error) {
      console.error('Error en PagarSuscripcionYapeUseCase:', error);
      return Result.failure('Error al crear orden Yape', error);
    }
  }
}