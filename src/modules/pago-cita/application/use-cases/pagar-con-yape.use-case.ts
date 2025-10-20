import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { PagoCita } from '../../domain/entities/pago-cita.entity';
import { PagoCitaRepository } from '../../domain/repositories/pago-cita.repository';
import { PAGO_CITA_REPOSITORY_TOKEN } from '../../infrastructure/pago-cita.repository.token';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../../cita/infrastructure/cita.repository.token';
import { PagoCitaService } from '../services/pago-cita.service';
import { MetodoPagoCita } from '../../domain/enums/metodo-pago-cita.enum';
import { EstadoPagoCita } from '../../domain/enums/estado-pago-cita.enum';
import { PagarConYapeDto } from '../../infrastructure/dto/pagar-con-yape.dto';

@Injectable()
export class PagarConYapeUseCase {
  constructor(
    @Inject(PAGO_CITA_REPOSITORY_TOKEN)
    private readonly pagoCitaRepository: PagoCitaRepository,
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    private readonly pagoCitaService: PagoCitaService,
  ) {}

  async execute(
    dto: PagarConYapeDto,
  ): Promise<Result<{ qrUrl: string; paymentUrl: string; orderId: string }>> {
    try {
      const { idCita, email } = dto;

      // Validar que la cita existe
      const citaResult = await this.citaRepository.findById(idCita);
      if (!citaResult.ok) {
        return Result.failure(`Error al buscar la cita: ${citaResult.message}`);
      }

      const cita = citaResult.value;
      if (!cita) {
        return Result.failure('La cita no existe');
      }

      // Validar que la cita NO está pagada
      if (cita.getEstadoPago() === 'pagado') {
        return Result.failure('La cita ya está pagada');
      }

      // Calcular monto total
      const montoTotal = await this.pagoCitaService.calcularMontoTotal(idCita);

      // Crear order en Culqi
      const culqiResponse = await this.pagoCitaService.crearOrderYape(
        montoTotal,
        email,
        idCita,
      );

      // Crear PagoCita con estado PENDIENTE
      const pagoCita = new PagoCita({
        cita,
        culqiChargeId: culqiResponse.id,
        metodoPago: MetodoPagoCita.YAPE,
        montoTotal,
        estado: EstadoPagoCita.PENDIENTE,
        culqiResponse,
        qrUrl: culqiResponse.qr_code || null,
        paymentUrl: culqiResponse.payment_url || null,
      });

      const createResult = await this.pagoCitaRepository.create(pagoCita);
      if (!createResult.ok) {
        return Result.failure(
          `Error al registrar el pago: ${createResult.message}`,
        );
      }

      return Result.success({
        qrUrl: culqiResponse.qr_code || '',
        paymentUrl: culqiResponse.payment_url || '',
        orderId: culqiResponse.id,
      });
    } catch (error) {
      return Result.failure('Error al procesar el pago con Yape', error);
    }
  }
}
