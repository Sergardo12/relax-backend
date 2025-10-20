import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { BeneficioMembresia } from '../../domain/entities/beneficio-membresia.entity';
import { BeneficioMembresiaRepository } from '../../domain/repositories/beneficio-membresia.repository';
import { BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN } from '../../infrastructure/beneficio-membresia.repository.token';
import { MembresiaRepository } from '../../../membresia/domain/repositories/membresia.repository';
import { MEMBRESIA_REPOSITORY_TOKEN } from '../../../membresia/infrastructure/membresia.repository.token';
import { ServicioRepository } from '../../../servicio/domain/repositories/servicio.repository';
import { SERVICIO_REPOSITORY } from '../../../servicio/infrastructure/servicio.repository.token';
import { CrearBeneficioMembresiaDto } from '../../infrastructure/dto/crear-beneficio-membresia.dto';

@Injectable()
export class CrearBeneficioMembresiaUseCase {
  constructor(
    @Inject(BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN)
    private readonly beneficioRepository: BeneficioMembresiaRepository,
    @Inject(MEMBRESIA_REPOSITORY_TOKEN)
    private readonly membresiaRepository: MembresiaRepository,
    @Inject(SERVICIO_REPOSITORY)
    private readonly servicioRepository: ServicioRepository,
  ) {}

  async execute(dto: CrearBeneficioMembresiaDto): Promise<Result<BeneficioMembresia>> {
    try {
      console.log("validamos que la membresia exista")
      // Validar que la membresía existe
      const membresiaResult = await this.membresiaRepository.findById(dto.idMembresia);
      console.log("Membresia existe: ", membresiaResult)
      if (!membresiaResult.ok) {
        return Result.failure('Membresía no encontrada');
      }

      // Validar que el servicio existe
      console.log("validamos que el servicio exista: ")
      const servicioResult = await this.servicioRepository.findById(dto.idServicio);
      console.log("validamos que el servicio exista: ", servicioResult)
      if (!servicioResult.ok) {
        return Result.failure('Servicio no encontrado');
      }

      // Validar cantidad
      if (dto.cantidad < 1) {
        return Result.failure('La cantidad debe ser al menos 1');
      }

      // Crear beneficio
      const beneficio = new BeneficioMembresia({
        membresia: membresiaResult.value,
        servicio: servicioResult.value,
        cantidad: dto.cantidad,
      });
      console.log("beenficio creado: ", beneficio)

      return await this.beneficioRepository.create(beneficio);
    } catch (error) {
      console.error('Error en CrearBeneficioMembresiaUseCase:', error);
      return Result.failure('Error al crear el beneficio', error);
    }
  }
}