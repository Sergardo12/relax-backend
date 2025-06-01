import { Inject, Injectable } from "@nestjs/common";
import { Rol } from "../../domain/entities/rol.entity";
import { RolRepository } from "../../domain/repositories/rol.repository";
import { CrearRolDto } from "../../infrastructure/dto/crear-rol";
import { ROL_REPOSITORY } from "../../rol.repository.token";


@Injectable()
export class CrearRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY)
    private readonly rolRepo: RolRepository
  ) {}

  async execute(dto: CrearRolDto): Promise<Rol> {
    const rol = new Rol(null, dto.nombreRol);
    return await this.rolRepo.crear(rol);
  }
}