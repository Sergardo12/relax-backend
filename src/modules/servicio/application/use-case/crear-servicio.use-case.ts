import { Inject, Injectable, Res } from '@nestjs/common';
import { SERVICIO_REPOSITORY } from "../../infrastructure/servicio.repository.token";
import { CrearServicioDto } from "../../infrastructure/dto/crear-servicio.dto";
import { Result } from "src/common/types/result";
import { Servicio } from "../../domain/entities/servicio.entity";
import { ESPECIALIDAD_REPOSITORY } from "src/modules/especialidad/infrastructure/especialidad.repository.token";
import { EspecialidadRepository } from "src/modules/especialidad/domain/repositories/especialidad.repository";
import { ServicioRepository } from '../../domain/repositories/servicio.repository';


@Injectable()
export class CrearServicioUseCase{
    constructor(
        @Inject(SERVICIO_REPOSITORY)
        private readonly servicioRepository: ServicioRepository,

        @Inject(ESPECIALIDAD_REPOSITORY)
        private readonly especialidadRepository: EspecialidadRepository
    ){}

    async ejecutar(dto: CrearServicioDto): Promise<Result<Servicio>>{
        // Buscamos por su nombre
        const existe = await this.servicioRepository.findByName(dto.nombre)
        if(existe.ok && existe.value){
            return Result.failure("Este servicio ya existe")
        }

        // Buscamos la especialdiad por id
        const especialdiadResult = await this.especialidadRepository.findById(dto.especialidadId)
        if(!especialdiadResult.ok || !especialdiadResult.value){
            return Result.failure('La especialdiad asoaciada no existe');
        }

        const especialdiad = especialdiadResult.value

        const nuevoServicio = new Servicio({
            especialidad: especialdiad,
            nombre: dto.nombre,
            descripcion: dto.descripcion,
            precio: dto.precio,
            duracion: dto.duracion
        })

        return await this.servicioRepository.create(nuevoServicio)

        
    }
}