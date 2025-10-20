import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';
import { PACIENTE_REPOSITORY } from '../../infrastructure/paciente.repository.token';
import { CrearPacienteDto } from '../../infrastructure/dto/completar-datos-paciente';
import { Paciente } from '../../domain/entities/paciente.entity';
import { Result } from '../../../../common/types/result';
import { USUARIO_REPOSITORY } from 'src/modules/usuario/infrastructure/usuario.repository.token';
import { UsuarioRepository } from 'src/modules/usuario/domain/repositories/usuario.repository';

@Injectable()
export class CompletarDatosPacienteUseCase {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async ejecutar(dto: CrearPacienteDto): Promise<Result<Paciente>> {
    // 1. Validar usuario
    const usuario = await this.usuarioRepository.findById(dto.usuarioId);
    if (!usuario) {
      return Result.failure('Usuario no encontrado');
    }

    // 2. Validar que sea rol paciente
    if (usuario.getRol().nombre !== 'paciente') {
      return Result.failure('El usuario debe tener rol de paciente');
    }

    // 3. Validar que no tenga perfil completo ya
    if (usuario.getPerfilCompleto()) {
      return Result.failure('El perfil ya está completo');
    }

    // 4. Validar fecha de nacimiento
    if (!dto.fechaNacimiento || isNaN(Date.parse(dto.fechaNacimiento))) {
      return Result.failure('Fecha de nacimiento inválida');
    }

    // 5. Crear paciente
    const nuevoPaciente = new Paciente({
      usuario: usuario,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      dni: dto.dni,
      fechaNacimiento: new Date(dto.fechaNacimiento),
      telefono: dto.telefono,
    });

    const pacienteResult = await this.pacienteRepository.create(nuevoPaciente);
    
    if (!pacienteResult.ok) {
      return pacienteResult;
    }

   
    await this.usuarioRepository.marcarPerfilCompleto(dto.usuarioId);

    return pacienteResult;
  }
}