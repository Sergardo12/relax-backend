import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { RolRepository } from "../../domain/repositories/rol.repository";
import { RolDto } from "../../infrastructure/dto/rol.dto";
import { Rol } from "../../domain/entities/rol.entity";
import { ROL_REPOSITORY } from "../../infrastructure/rol.repository.token";
import { EstadoRol } from "../../domain/enums/rol.enum";

@Injectable()
export class CrearRolUseCase {
    constructor(
        @Inject(ROL_REPOSITORY)
        private readonly rolRepo: RolRepository
    ){}


    async ejecutar(dto: RolDto): Promise<Rol>{
        const rolExistente = await this.rolRepo.findByName(dto.nombre);
        if(rolExistente){
            throw new ConflictException('El rol ya existe');
        }

        const nuevoRol = new Rol({
            nombre: dto.nombre,
            descripcion: dto.descripcion
        });

        return this.rolRepo.create(nuevoRol);
    } 
}
