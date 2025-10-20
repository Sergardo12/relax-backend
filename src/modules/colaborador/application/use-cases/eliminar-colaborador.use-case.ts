import { Inject, Injectable } from '@nestjs/common';
import { ColaboradorRepository } from '../../domain/repositories/colaborador.repository';
import { COLABORADOR_REPOSITORY } from '../../infrastructure/colaborador.repository.token';
import { UsuarioRepository } from '../../../usuario/domain/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from '../../../usuario/infrastructure/usuario.repository.token';
import { Colaborador } from '../../domain/entities/colaborador.entity';
import { Result } from 'src/common/types/result';
import { Usuario } from '../../../usuario/domain/entities/usuario.entity';
import { EstadoUsuario } from '../../../usuario/domain/enums/usuario.enum';

@Injectable()
export class EliminarColaboradorUseCase {
  constructor(
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async ejecutar(id: string): Promise<Result<Colaborador>> {
    // Obtener el colaborador
    const colaboradorResult = await this.colaboradorRepository.findById(id);
    if (!colaboradorResult.ok) {
      return Result.failure('Error al buscar el colaborador');
    }
    if (!colaboradorResult.value) {
      return Result.failure('El colaborador no existe');
    }

    const colaborador = colaboradorResult.value;
    const usuario = colaborador.getUsuario();

    // Crear un nuevo usuario con estado INACTIVO
    const usuarioInactivo = new Usuario({
      id: usuario.getId(),
      correo: usuario.correo,
      contraseña: usuario.getContraseña(),
      rol: usuario.getRol(),
      estado: EstadoUsuario.INACTIVO,
    });

    // Actualizar el estado del usuario a INACTIVO (eliminado lógico)
    await this.usuarioRepository.update(usuarioInactivo);

    // Retornar el colaborador
    return Result.success(colaborador);
  }
}
