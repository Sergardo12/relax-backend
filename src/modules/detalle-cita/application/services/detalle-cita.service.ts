import { Injectable, Inject } from '@nestjs/common';
import { ServicioRepository } from 'src/modules/servicio/domain/repositories/servicio.repository';
import { ColaboradorRepository } from 'src/modules/colaborador/domain/repositories/colaborador.repository';
import { SERVICIO_REPOSITORY } from 'src/modules/servicio/infrastructure/servicio.repository.token';
import { COLABORADOR_REPOSITORY } from 'src/modules/colaborador/infrastructure/colaborador.repository.token';
import { Result } from 'src/common/types/result';

@Injectable()
export class DetalleCitaService {
  constructor(
    @Inject(SERVICIO_REPOSITORY)
    private readonly servicioRepository: ServicioRepository,
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
  ) {}

  async obtenerPrecioServicio(idServicio: string): Promise<Result<number>> {
    const servicioResult = await this.servicioRepository.findById(idServicio);
    if (!servicioResult.ok) {
      return Result.failure(
        `No se encontró el servicio con ID ${idServicio}`,
        servicioResult.error,
      );
    }
    return Result.success(servicioResult.value.precio);
  }

  calcularSubtotal(precioUnitario: number, cantidad: number): number {
    return precioUnitario * cantidad;
  }

  async validarColaboradorPuedeOfrecer(
    idColaborador: string,
    idServicio: string,
  ): Promise<Result<boolean>> {
    const [colaboradorResult, servicioResult] = await Promise.all([
      this.colaboradorRepository.findById(idColaborador),
      this.servicioRepository.findById(idServicio),
    ]);

    if (!colaboradorResult.ok) {
      return Result.failure(
        `No se encontró el colaborador con ID ${idColaborador}`,
        colaboradorResult.error,
      );
    }

    if (!servicioResult.ok) {
      return Result.failure(
        `No se encontró el servicio con ID ${idServicio}`,
        servicioResult.error,
      );
    }

    const colaborador = colaboradorResult.value;
    const servicio = servicioResult.value;

    if (colaborador.getEspecialidad().id !== servicio.especialidad.id) {
      return Result.failure(
        `El colaborador no tiene la especialidad requerida para ofrecer este servicio`,
      );
    }

    return Result.success(true);
  }
}
