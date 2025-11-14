import { Inject, Injectable } from '@nestjs/common';
import { ColaboradorRepository } from '../../domain/repositories/colaborador.repository';
import { COLABORADOR_REPOSITORY } from '../../infrastructure/colaborador.repository.token';
import { EspecialidadRepository } from 'src/modules/especialidad/domain/repositories/especialidad.repository';
import { ESPECIALIDAD_REPOSITORY } from 'src/modules/especialidad/infrastructure/especialidad.repository.token';
import { Colaborador } from '../../domain/entities/colaborador.entity';
import { ColaboradorService } from '../services/colaborador.service';
import { Result } from 'src/common/types/result';
import { CrearColaboradorDto } from '../../infrastructure/dto/crear-colaborador.dto';
import { USUARIO_REPOSITORY } from 'src/modules/usuario/infrastructure/usuario.repository.token';
import { UsuarioRepository } from 'src/modules/usuario/domain/repositories/usuario.repository';

@Injectable()
export class CrearColaboradorUseCase {
  constructor(
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
    @Inject(ESPECIALIDAD_REPOSITORY)
    private readonly especialidadRepository: EspecialidadRepository,
    private readonly colaboradorService: ColaboradorService,
  ) {}

  async ejecutar(dto: CrearColaboradorDto): Promise<Result<Colaborador>> {
    const {
      idUsuario,
      idEspecialidad,
      nombres,
      apellidos,
      dni,
      fechaNacimiento: fechaNacimientoString,
      fechaContratacion: fechaContratacionString,
      telefono,
    } = dto;

    // 1. Validar que el usuario existe
    const usuario = await this.usuarioRepository.findById(idUsuario);
    if (!usuario) {
      return Result.failure('El usuario especificado no existe');
    }

    const rolesPermitidos = ['colaborador', 'administrador', 'recepcionista'];
    if (!rolesPermitidos.includes(usuario.getRol().nombre)) {
      return Result.failure(
        'El usuario debe tener rol de colaborador, administrador o recepcionista',
      );
    }

    // 3. Validar que el usuario NO tiene ya un registro de Colaborador (evitar duplicados)
    const colaboradorExistenteResult =
      await this.colaboradorRepository.findByUsuarioId(idUsuario);
    // Si ok es true y hay un valor, significa que ya existe
    if (colaboradorExistenteResult.ok) {
      return Result.failure('Este usuario ya tiene un registro de colaborador');
    }

    // 4. Validar que la especialidad existe
    const especialidadResult =
      await this.especialidadRepository.findById(idEspecialidad);
    if (!especialidadResult.ok) {
      return Result.failure('Error al buscar la especialidad');
    }
    if (!especialidadResult.value) {
      return Result.failure('La especialidad especificada no existe');
    }

    const especialidad = especialidadResult.value;

    // 5. Validar DNI (8 dígitos)
    if (!this.colaboradorService.validarDni(dni)) {
      return Result.failure('El DNI debe tener exactamente 8 dígitos numéricos');
    }

    // 6. Validar teléfono (9 dígitos)
    if (!this.colaboradorService.validarTelefono(telefono)) {
      return Result.failure(
        'El teléfono debe tener exactamente 9 dígitos numéricos',
      );
    }

    // 7. Convertir fechas de string a Date
    const fechaNacimiento = new Date(fechaNacimientoString + 'T12:00:00');
    const fechaContratacion = new Date(fechaContratacionString + 'T12:00:00');

    // 8. Validar edad mínima (18 años)
    if (!this.colaboradorService.validarEdadMinima(fechaNacimiento)) {
      return Result.failure('El colaborador debe ser mayor de 18 años');
    }

    // 9. Crear el colaborador
    const nuevoColaborador = new Colaborador({
      usuario,
      especialidad,
      nombres,
      apellidos,
      dni,
      fechaNacimiento,
      fechaContratacion,
      telefono,
    });

    // 10. Guardar en el repositorio
  const colaboradorResult = await this.colaboradorRepository.create(nuevoColaborador);

  if (!colaboradorResult.ok) {
   return colaboradorResult;
  }

  // ⭐ 11. Marcar usuario como perfil completo
  await this.usuarioRepository.marcarPerfilCompleto(dto.idUsuario);

  return colaboradorResult;
  }
}
