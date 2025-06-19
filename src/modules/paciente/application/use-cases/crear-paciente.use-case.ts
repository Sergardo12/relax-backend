import { Inject, Injectable } from "@nestjs/common";
import { Paciente } from "../../domain/entities/paciente.entity";
import { PacienteRepository } from "../../domain/repositories/paciente.repository";
import { CrearPacienteDto } from "../../infrastructure/dto/crear-paciente.dto";
import { PACIENTE_REPOSITORY } from "../../paciente.repository.token";
import { CrearHistorialMedicoUseCase } from "../../../historial-medico/application/use-cases/crear.historial-medico.use-case";
import { HISTORIAL_MEDICO_REPOSITORY } from "../../../historial-medico/historial-medico.repository.token"
import { USUARIO_REPOSITORY } from "../../../usuario/usuario.repository.token";
import { UsuarioRepository } from "../../../usuario/domain/repositories/usuario.repository";

@Injectable()
export class CrearPacienteUseCase {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepo: PacienteRepository,
    @Inject(CrearHistorialMedicoUseCase)
    private readonly crearHistorialUseCase: CrearHistorialMedicoUseCase,
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepo: UsuarioRepository, // Para obtener el usuario por ID si es necesario
  ) {}

  async ejecutar(dto: CrearPacienteDto): Promise<Paciente> {
   const usuario = await this.usuarioRepo.buscarPorId(dto.usuario);
   if (!usuario) {
     throw new Error('Usuario no encontrado');
   }

    const paciente = new Paciente(
      null,
      usuario,
      dto.nombres,
      dto.apellidos,
      dto.dni,
      dto.edad,
      dto.telefono,
      true
    );

    const pacienteCreado = await this.pacienteRepo.crear(paciente);

    await this.crearHistorialUseCase.execute({
      fechaHistorial: new Date(),
      paciente: pacienteCreado,
      citas: [],
    });

    return pacienteCreado;
  }
}
