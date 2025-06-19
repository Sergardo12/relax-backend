import { Inject } from "@nestjs/common";
import { ColaboradorRepository } from "../../domain/repositories/colaborador.repository";
import { CrearColaboradorDto } from "../../infrastructure/dto/crear-colaborador.dto";
import { Colaborador } from "../../domain/entities/colaborador.entity";
import { Usuario } from "../../../usuario/domain/entities/usuario.entity";
import { COLABORADOR_REPOSITORY } from "../../colaborador.repository.token";
import { USUARIO_REPOSITORY } from "../../../usuario/usuario.repository.token";
import { UsuarioRepository } from "../../../usuario/domain/repositories/usuario.repository";

export class CrearColaboradorUseCase {
    constructor(
        @Inject(COLABORADOR_REPOSITORY)
        private readonly colaboradorRepo: ColaboradorRepository,
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: UsuarioRepository, // Para obtener el usuario por ID si es necesario
    ){}

    async ejecutar(dto: CrearColaboradorDto): Promise<Colaborador> {
  const usuarioExiste = await this.usuarioRepo.buscarPorId(dto.usuario);
  if (!usuarioExiste) {
    throw new Error('Usuario no encontrado');
  }

  // ✅ Validar que el usuario tenga un rol
  if (!usuarioExiste.rol) {
    throw new Error('El usuario no tiene un rol asignado');
  }

  // ✅ Validar que el rol sea permitido para colaborador
  const rolValido = ['administrador', 'recepcionista', 'quiropractico', 'manicurista'];
  if (!rolValido.includes(usuarioExiste.rol.nombreRol.toLowerCase())) {
    throw new Error(`El rol '${usuarioExiste.rol.nombreRol}' no es válido para un colaborador.`);
  }

  const colaborador = new Colaborador(
    null,
    usuarioExiste,
    dto.nombres,
    dto.apellidos,
    dto.dni,
    dto.telefono,
    dto.fecha_contratacion,
    true // estadoColaborador por defecto
  );

  return await this.colaboradorRepo.crear(colaborador);
}
}