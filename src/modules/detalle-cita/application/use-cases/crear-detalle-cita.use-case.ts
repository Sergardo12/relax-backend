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
import { ConsumoBeneficioService } from 'src/modules/consumo-beneficio/application/services/consumo-beneficio.service'; // ⭐
import { CONSUMO_BENEFICIO_REPOSITORY_TOKEN } from 'src/modules/consumo-beneficio/infrastructure/consumo-beneficio.repository.token'; // ⭐
import { ConsumoBeneficioRepository } from 'src/modules/consumo-beneficio/domain/repositories/consumo-beneficio.repository'; // ⭐
import { ConsumoBeneficio } from 'src/modules/consumo-beneficio/domain/entities/consumo-beneficio.entity';

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
    @Inject(CONSUMO_BENEFICIO_REPOSITORY_TOKEN) // ⭐
    private readonly consumoBeneficioRepository: ConsumoBeneficioRepository,
    private readonly detalleCitaService: DetalleCitaService,
    private readonly consumoBeneficioService: ConsumoBeneficioService, // ⭐
  ) {}

  async ejecutar(dto: CrearDetalleCitaDto): Promise<Result<DetalleCita>> {
  const { idCita, idServicio, idColaborador, cantidad = 1, pagarConMembresia = false } = dto;

  // 1. Validar que la cita exista
  const citaResult = await this.citaRepository.findById(idCita);
  if (!citaResult.ok || !citaResult.value) {
    return Result.failure(`No se encontró la cita con ID ${idCita}`);
  }

  const cita = citaResult.value;

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

  // ⭐ 4. Variables para membresía (declaración explícita de tipos)
  let esConMembresia = false;
  let consumoBeneficio: ConsumoBeneficio | undefined = undefined; // ⭐ Tipo explícito
  let subtotal = this.detalleCitaService.calcularSubtotal(precioResult.value, cantidad);

  // ⭐ 5. SOLO si paga con membresía
  if (pagarConMembresia) {
    console.log('🎫 Cliente quiere pagar con membresía');
    
    const idPaciente = cita.getPaciente().getId();
    console.log('🎫 ID Paciente:', idPaciente);
    console.log('🎫 ID Servicio:', idServicio);

    // Validar beneficio disponible
    const beneficioResult = await this.consumoBeneficioService.validarBeneficioDisponible(
      idPaciente,
      idServicio,
      cantidad,
    );

    if (!beneficioResult.ok) {
      console.log('❌ No tiene beneficio disponible:', beneficioResult.message);
      return Result.failure(beneficioResult.message);
    }

    // Obtener entity completa
    const consumoId = beneficioResult.value.getId();
    const consumoResult = await this.consumoBeneficioRepository.findById(consumoId);

    if (!consumoResult.ok || !consumoResult.value) {
      return Result.failure('Error al obtener el consumo de beneficio');
    }

    // ⭐ Asignar valores
    consumoBeneficio = consumoResult.value;
    esConMembresia = true;
    subtotal = 0;

    console.log('✅ Beneficio validado. ID Consumo:', consumoBeneficio.getId());
  }

  // 6. Obtener las entidades completas
  const servicioResult = await this.servicioRepository.findById(idServicio);
  if (!servicioResult.ok) {
    return Result.failure(`Error al obtener el servicio: ${servicioResult.message}`);
  }

  const colaboradorResult =
    await this.colaboradorRepository.findById(idColaborador);
  if (!colaboradorResult.ok) {
    return Result.failure(`Error al obtener el colaborador: ${colaboradorResult.message}`);
  }

  // 7. Crear el detalle de cita
  const nuevoDetalle = new DetalleCita({
  cita: cita,
  servicio: servicioResult.value,
  colaborador: colaboradorResult.value,
  consumoBeneficio: consumoBeneficio,
  precioUnitario: precioResult.value,
  cantidad,
  subtotal,
  esConMembresia,
  fechaRegistro: new Date(),
});

console.log('📝 Creando DetalleCita:', {
  esConMembresia,
  consumoBeneficioId: consumoBeneficio?.getId(),
  subtotal,
});

// ⭐ AGREGAR ESTOS LOGS
console.log('💾 Intentando guardar en repositorio...');
console.log('📦 Entity completa:', {
  citaId: nuevoDetalle.getCita().getId(),
  servicioId: nuevoDetalle.getServicio().id,
  colaboradorId: nuevoDetalle.getColaborador().getId(),
  consumoBeneficioId: nuevoDetalle.getConsumoBeneficio()?.getId(),
  esConMembresia: nuevoDetalle.getEsConMembresia(),
  subtotal: nuevoDetalle.getSubtotal(),
});

try {
  const resultado = await this.detalleCitaRepository.create(nuevoDetalle);
  
  console.log('🔍 Resultado del repositorio:', {
    ok: resultado.ok
  });
  
  if (resultado.ok) {
    console.log('✅ DetalleCita guardado exitosamente:', resultado.value?.getId());
  } else {
    console.error('❌ Error del repositorio:', resultado.message);
  }
  
  return resultado;
} catch (error) {
  console.error('💥 EXCEPCIÓN al guardar:', error);
  console.error('💥 Stack completo:', error.stack);
  return Result.failure('Error inesperado al guardar detalle de cita', error);
}
}
}