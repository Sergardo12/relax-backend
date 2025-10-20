import { Inject, Injectable } from '@nestjs/common';
import { DetalleCitaRepository } from '../../domain/repositories/detalle-cita.repository';
import { DETALLE_CITA_REPOSITORY_TOKEN } from '../../infrastructure/detalle-cita.repository.token';
import { CITA_REPOSITORY } from 'src/modules/cita/infrastructure/cita.repository.token';
import { CitaRepository } from 'src/modules/cita/domain/repositories/cita.repository';
import { DetalleCita } from '../../domain/entities/detalle-cita.entity';
import { DetalleCitaService } from '../services/detalle-cita.service';
import { Result } from 'src/common/types/result';
import { ServicioRepository } from 'src/modules/servicio/domain/repositories/servicio.repository';
import { ColaboradorRepository } from 'src/modules/colaborador/domain/repositories/colaborador.repository';
import { SERVICIO_REPOSITORY } from 'src/modules/servicio/infrastructure/servicio.repository.token';
import { COLABORADOR_REPOSITORY } from 'src/modules/colaborador/infrastructure/colaborador.repository.token';
import { CrearDetalleCitaDto } from '../../infrastructure/dto/crear-detalle-cita.dto';

@Injectable()
export class CrearDetalleCitaUseCase {
  constructor(
    @Inject(DETALLE_CITA_REPOSITORY_TOKEN)
    private readonly detalleCitaRepository: DetalleCitaRepository,
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    @Inject(SERVICIO_REPOSITORY)
    private readonly servicioRepository: ServicioRepository,
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
    private readonly detalleCitaService: DetalleCitaService,
  ) {}

  async ejecutar(dto: CrearDetalleCitaDto): Promise<Result<DetalleCita>> {
    const { idCita, idServicio, idColaborador, cantidad = 1 } = dto;
    // 1. Validar que la cita exista
    const citaResult = await this.citaRepository.findById(idCita);
    if (!citaResult.ok || !citaResult.value) {
      return Result.failure(`No se encontró la cita con ID ${idCita}`);
    }

    // 2. Validar que el colaborador puede ofrecer el servicio
    const validacionResult =
      await this.detalleCitaService.validarColaboradorPuedeOfrecer(
        idColaborador,
        idServicio,
      );
    if (!validacionResult.ok) {
      return Result.failure(validacionResult.message);
    }

    // 3. Obtener precio del servicio
    const precioResult =
      await this.detalleCitaService.obtenerPrecioServicio(idServicio);
    if (!precioResult.ok) {
      return Result.failure(precioResult.message);
    }

    // 4. Calcular subtotal
    const subtotal = this.detalleCitaService.calcularSubtotal(
      precioResult.value,
      cantidad,
    );

    // 5. Obtener las entidades completas
    const servicioResult = await this.servicioRepository.findById(idServicio);
    if (!servicioResult.ok) {
      return Result.failure(`Error al obtener el servicio: ${servicioResult.message}`);
    }

    const colaboradorResult =
      await this.colaboradorRepository.findById(idColaborador);
    if (!colaboradorResult.ok) {
      return Result.failure(`Error al obtener el colaborador: ${colaboradorResult.message}`);
    }

    // 6. Crear el detalle de cita
    const nuevoDetalle = new DetalleCita({
      cita: citaResult.value,
      servicio: servicioResult.value,
      colaborador: colaboradorResult.value,
      precioUnitario: precioResult.value,
      cantidad,
      subtotal,
      fechaRegistro: new Date(),
    });

    // 7. Guardar en el repositorio
    return await this.detalleCitaRepository.create(nuevoDetalle);
  }
}
