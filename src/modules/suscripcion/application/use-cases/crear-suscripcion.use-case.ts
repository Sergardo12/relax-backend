import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Suscripcion } from '../../domain/entities/suscripcion.entity';
import { SuscripcionRepository } from '../../domain/repositories/suscripcion.repository';
import { SUSCRIPCION_REPOSITORY_TOKEN } from '../../infrastructure/suscripcion.repository.token';
import { PacienteRepository } from '../../../paciente/domain/repositories/paciente.repository';
import { PACIENTE_REPOSITORY } from '../../../paciente/infrastructure/paciente.repository.token';
import { MembresiaRepository } from '../../../membresia/domain/repositories/membresia.repository';
import { MEMBRESIA_REPOSITORY_TOKEN } from '../../../membresia/infrastructure/membresia.repository.token';
import { BeneficioMembresiaRepository } from '../../../beneficio-membresia/domain/repositories/beneficio-membresia.repository';
import { BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN } from '../../../beneficio-membresia/infrastructure/beneficio-membresia.repository.token';
import { ConsumoBeneficioRepository } from '../../../consumo-beneficio/domain/repositories/consumo-beneficio.repository';
import { CONSUMO_BENEFICIO_REPOSITORY_TOKEN } from '../../../consumo-beneficio/infrastructure/consumo-beneficio.repository.token';
import { ConsumoBeneficio } from '../../../consumo-beneficio/domain/entities/consumo-beneficio.entity';
import { CrearSuscripcionDto } from '../../infrastructure/dto/crear-suscripcion.dto';

@Injectable()
export class CrearSuscripcionUseCase {
  constructor(
    @Inject(SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly suscripcionRepository: SuscripcionRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
    @Inject(MEMBRESIA_REPOSITORY_TOKEN)
    private readonly membresiaRepository: MembresiaRepository,
    @Inject(BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN)
    private readonly beneficioMembresiaRepository: BeneficioMembresiaRepository,
    @Inject(CONSUMO_BENEFICIO_REPOSITORY_TOKEN)
    private readonly consumoBeneficioRepository: ConsumoBeneficioRepository,
  ) {}

  async execute(dto: CrearSuscripcionDto): Promise<Result<Suscripcion>> {
    try {
      // 1. Validar que el paciente existe
      const pacienteResult = await this.pacienteRepository.findById(dto.idPaciente);
      if (!pacienteResult.ok) {
        return Result.failure('Paciente no encontrado');
      }

      // 2. Validar que la membresía existe y está activa
      const membresiaResult = await this.membresiaRepository.findById(dto.idMembresia);
      if (!membresiaResult.ok) {
        return Result.failure('Membresía no encontrada');
      }

      const membresia = membresiaResult.value;
      if (membresia.getEstado() !== 'activa') {
        return Result.failure('La membresía no está activa');
      }

      // 3. Crear la suscripción (estado: pendiente_pago)
      const suscripcion = new Suscripcion({
        paciente: pacienteResult.value,
        membresia: membresia,
      });

      const suscripcionResult = await this.suscripcionRepository.create(suscripcion);
      if (!suscripcionResult.ok) {
        return Result.failure('Error al crear la suscripción');
      }

      // 4. Obtener los beneficios de la membresía
      const beneficiosResult = await this.beneficioMembresiaRepository.findByMembresiaId(
        dto.idMembresia,
      );

      if (!beneficiosResult.ok || beneficiosResult.value.length === 0) {
        return Result.failure('La membresía no tiene beneficios configurados');
      }

      // 5. Crear automáticamente los ConsumoBeneficio
      console.log('🎁 Creando consumos de beneficios...');
      for (const beneficio of beneficiosResult.value) {
        const consumo = new ConsumoBeneficio({
          suscripcion: suscripcionResult.value,
          servicio: beneficio.getServicio(),
          cantidadTotal: beneficio.getCantidad(),
          cantidadConsumida: 0,
          cantidadDisponible: beneficio.getCantidad(),
        });

        const consumoResult = await this.consumoBeneficioRepository.create(consumo);
        if (!consumoResult.ok) {
          console.error('Error al crear consumo:', consumoResult.message);
        } else {
          console.log(`✅ Consumo creado: ${beneficio.getServicio().nombre} x${beneficio.getCantidad()}`);
        }
      }

      return Result.success(suscripcionResult.value);
    } catch (error) {
      console.error('Error en CrearSuscripcionUseCase:', error);
      return Result.failure('Error al crear la suscripción', error);
    }
  }
}