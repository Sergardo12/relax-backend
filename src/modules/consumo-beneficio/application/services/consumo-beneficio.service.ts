import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ConsumoBeneficio } from '../../domain/entities/consumo-beneficio.entity';
import { ConsumoBeneficioRepository } from '../../domain/repositories/consumo-beneficio.repository';
import { CONSUMO_BENEFICIO_REPOSITORY_TOKEN } from '../../infrastructure/consumo-beneficio.repository.token';
import { SuscripcionRepository } from '../../../suscripcion/domain/repositories/suscripcion.repository';
import { SUSCRIPCION_REPOSITORY_TOKEN } from '../../../suscripcion/infrastructure/suscripcion.repository.token';

@Injectable()
export class ConsumoBeneficioService {
  constructor(
    @Inject(CONSUMO_BENEFICIO_REPOSITORY_TOKEN)
    private readonly consumoRepository: ConsumoBeneficioRepository,
    @Inject(SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly suscripcionRepository: SuscripcionRepository,
  ) {}

  /**
   * Valida si el paciente tiene beneficios disponibles para un servicio
   */
  async validarBeneficioDisponible(
    idPaciente: string,
    idServicio: string,
    cantidad: number = 1,
  ): Promise<Result<ConsumoBeneficio>> {
    try {
      // 1. Buscar suscripciones activas del paciente
      const suscripcionesResult = await this.suscripcionRepository.findActivasByPacienteId(
        idPaciente,
      );

      if (!suscripcionesResult.ok || suscripcionesResult.value.length === 0) {
        return Result.failure('El paciente no tiene suscripciones activas');
      }

      // 2. Buscar en cada suscripción si tiene el servicio disponible
      for (const suscripcion of suscripcionesResult.value) {
        // Validar que la suscripción esté vigente
        if (!suscripcion.estaActiva()) {
          continue;
        }

        // Buscar el consumo de beneficio para este servicio
        const consumoResult = await this.consumoRepository.findByServicioAndSuscripcion(
          idServicio,
          suscripcion.getId(),
        );

        if (consumoResult.ok) {
          const consumo = consumoResult.value;

          // Verificar si tiene disponibles
          if (consumo.tieneDisponible(cantidad)) {
            return Result.success(consumo);
          }
        }
      }

      return Result.failure('No hay beneficios disponibles para este servicio');
    } catch (error) {
      console.error('Error en validarBeneficioDisponible:', error);
      return Result.failure('Error al validar beneficio disponible', error);
    }
  }

  /**
   * Consume un beneficio (descuenta la cantidad)
   */
  async consumirBeneficio(
    idConsumoBeneficio: string,
    cantidad: number = 1,
  ): Promise<Result<ConsumoBeneficio>> {
    try {
      // 1. Buscar el consumo
      const consumoResult = await this.consumoRepository.findById(idConsumoBeneficio);
      if (!consumoResult.ok) {
        return Result.failure('Consumo de beneficio no encontrado');
      }

      const consumo = consumoResult.value;

      // 2. Validar que la suscripción esté activa
      if (!consumo.getSuscripcion().estaActiva()) {
        return Result.failure('La suscripción no está activa');
      }

      // 3. Intentar consumir
      const consumido = consumo.consumir(cantidad);
      if (!consumido) {
        return Result.failure(
          `No hay suficientes beneficios disponibles. Disponibles: ${consumo.getCantidadDisponible()}`,
        );
      }

      // 4. Guardar cambios
      return await this.consumoRepository.update(idConsumoBeneficio, consumo);
    } catch (error) {
      console.error('Error en consumirBeneficio:', error);
      return Result.failure('Error al consumir beneficio', error);
    }
  }

  /**
   * Devuelve un beneficio (incrementa la cantidad disponible)
   * Útil si se cancela una cita
   */
  async devolverBeneficio(
    idConsumoBeneficio: string,
    cantidad: number = 1,
  ): Promise<Result<ConsumoBeneficio>> {
    try {
      const consumoResult = await this.consumoRepository.findById(idConsumoBeneficio);
      if (!consumoResult.ok) {
        return Result.failure('Consumo de beneficio no encontrado');
      }

      const consumo = consumoResult.value;

      // Crear un nuevo consumo con los valores actualizados
      const consumoActualizado = new ConsumoBeneficio({
        id: consumo.getId(),
        suscripcion: consumo.getSuscripcion(),
        servicio: consumo.getServicio(),
        cantidadTotal: consumo.getCantidadTotal(),
        cantidadConsumida: Math.max(0, consumo.getCantidadConsumida() - cantidad),
        cantidadDisponible: Math.min(
          consumo.getCantidadTotal(),
          consumo.getCantidadDisponible() + cantidad,
        ),
      });

      return await this.consumoRepository.update(idConsumoBeneficio, consumoActualizado);
    } catch (error) {
      console.error('Error en devolverBeneficio:', error);
      return Result.failure('Error al devolver beneficio', error);
    }
  }
}