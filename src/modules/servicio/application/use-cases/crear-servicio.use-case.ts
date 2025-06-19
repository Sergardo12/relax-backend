import { Inject, Injectable } from '@nestjs/common';
import { Servicio } from '../../domain/entities/servicio.entity';
import { ServicioRepository} from '../../domain/repositories/servicio.repository';
import { CrearServicioDto } from '../../infrastructure/dto/crear-servicio.dto';
import { SERVICIO_REPOSITORY } from '../../servicio.repository.token';

@Injectable()
export class CrearServicioUseCase {
  constructor(
    @Inject(SERVICIO_REPOSITORY)
    private readonly servicioRepo: ServicioRepository,
  ) {}

  async ejecutar(dto: CrearServicioDto): Promise<Servicio> {
    const servicio = new Servicio(
      null,
      dto.nombreServicio,
      dto.descripcionServicio,
      dto.precioServicio,
      dto.duracionServicio,
      true
    );

    return this.servicioRepo.crear(servicio);
  }
}
