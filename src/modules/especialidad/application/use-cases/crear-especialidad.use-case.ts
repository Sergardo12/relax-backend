import { Inject, Injectable } from "@nestjs/common";
import { EspecialidadRepository } from "../../domain/repositories/especialidad.repository";
import { ESPECIALIDAD_REPOSITORY } from "../../infrastructure/especialidad.repository.token";
import { CrearEspecialidadDto } from "../../infrastructure/dto/crearEspecialidad.dto";
import { Result } from "../../../../common/types/result";
import { Especialidad } from "../../domain/entities/especialidad.entity";


@Injectable()
export class CrearEspecialidadUseCase {
  constructor(
    @Inject(ESPECIALIDAD_REPOSITORY)
    private readonly especialidadRepository: EspecialidadRepository,
  ) {}

  async ejecutar(dto: CrearEspecialidadDto): Promise<Result<Especialidad>> {
    // 1 buscar por su nombre
   const existente = await this.especialidadRepository.findByName(dto.nombre);
    if (existente.ok && existente.value) {
    return Result.failure("Esta especialidad ya existe");
    }
    // 2️⃣ Crear nueva especialidad (el estado se asigna por defecto en la entidad)
    const nuevaEspecialidad = new Especialidad({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    });

    // 3️⃣ Guardar en el repositorio
    return await this.especialidadRepository.create(nuevaEspecialidad);
  }
}
