import { Inject, Injectable } from '@nestjs/common';
import { ColaboradorRepository } from '../../domain/repositories/colaborador.repository';
import { COLABORADOR_REPOSITORY } from '../../infrastructure/colaborador.repository.token';
import { EspecialidadRepository } from 'src/modules/especialidad/domain/repositories/especialidad.repository';
import { ESPECIALIDAD_REPOSITORY } from 'src/modules/especialidad/infrastructure/especialidad.repository.token';
import { Colaborador } from '../../domain/entities/colaborador.entity';
import { ColaboradorService } from '../services/colaborador.service';
import { Result } from 'src/common/types/result';
import { ActualizarColaboradorDto } from '../../infrastructure/dto/actualizar-colaborador.dto';

@Injectable()
export class ActualizarColaboradorUseCase {
  constructor(
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
    @Inject(ESPECIALIDAD_REPOSITORY)
    private readonly especialidadRepository: EspecialidadRepository,
    private readonly colaboradorService: ColaboradorService,
  ) {}

  async ejecutar(
    id: string,
    dto: ActualizarColaboradorDto,
  ): Promise<Result<Colaborador>> {
    // Obtener el colaborador existente
    const colaboradorResult = await this.colaboradorRepository.findById(id);
    if (!colaboradorResult.ok) {
      return Result.failure('Error al buscar el colaborador');
    }
    if (!colaboradorResult.value) {
      return Result.failure('El colaborador no existe');
    }

    const colaboradorExistente = colaboradorResult.value;

    // Validar especialidad si se proporciona
    let especialidad = colaboradorExistente.getEspecialidad();
    if (dto.idEspecialidad) {
      const especialidadResult = await this.especialidadRepository.findById(
        dto.idEspecialidad,
      );
      if (!especialidadResult.ok) {
        return Result.failure('Error al buscar la especialidad');
      }
      if (!especialidadResult.value) {
        return Result.failure('La especialidad especificada no existe');
      }
      especialidad = especialidadResult.value;
    }

    // Validar DNI si se proporciona
    if (dto.dni && !this.colaboradorService.validarDni(dto.dni)) {
      return Result.failure('El DNI debe tener exactamente 8 dígitos numéricos');
    }

    // Validar teléfono si se proporciona
    if (dto.telefono && !this.colaboradorService.validarTelefono(dto.telefono)) {
      return Result.failure(
        'El teléfono debe tener exactamente 9 dígitos numéricos',
      );
    }

    // Convertir y validar fecha de nacimiento si se proporciona
    let fechaNacimiento = colaboradorExistente.getFechaNacimiento();
    if (dto.fechaNacimiento) {
      fechaNacimiento = new Date(dto.fechaNacimiento);
      if (!this.colaboradorService.validarEdadMinima(fechaNacimiento)) {
        return Result.failure('El colaborador debe ser mayor de 18 años');
      }
    }

    // Convertir fecha de contratación si se proporciona
    const fechaContratacion = dto.fechaContratacion
      ? new Date(dto.fechaContratacion)
      : colaboradorExistente.getFechaContratacion();

    // Crear colaborador actualizado
    const colaboradorActualizado = new Colaborador({
      id: colaboradorExistente.getId(),
      usuario: colaboradorExistente.getUsuario(),
      especialidad: especialidad,
      nombres: dto.nombres ?? colaboradorExistente.getNombres(),
      apellidos: dto.apellidos ?? colaboradorExistente.getApellidos(),
      dni: dto.dni ?? colaboradorExistente.getDni(),
      fechaNacimiento: fechaNacimiento,
      fechaContratacion: fechaContratacion,
      telefono: dto.telefono ?? colaboradorExistente.getTelefono(),
    });

    return await this.colaboradorRepository.update(id, colaboradorActualizado);
  }
}
