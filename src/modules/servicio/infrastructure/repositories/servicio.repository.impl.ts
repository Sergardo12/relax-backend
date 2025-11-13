import { Repository } from "typeorm";
import { ServicioRepository } from "../../domain/repositories/servicio.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServicioOrmEntity } from 'src/modules/servicio/infrastructure/database/servicio.orm-entity';
import { Result } from "src/common/types/result";
import { Servicio } from "../../domain/entities/servicio.entity";
import { ServicioMapper } from "../mapper/servicio.mapper";
import { EstadoServicio } from "../../domain/enum/servicio.enum";

@Injectable()
export class ServicioRepositoryImpl implements ServicioRepository{
    constructor(
        @InjectRepository(ServicioOrmEntity)
        private servicioRepository: Repository<ServicioOrmEntity>
    ){}

    async create(servicio: Servicio): Promise<Result<Servicio>> {
        try{
            const ormEntity = ServicioMapper.toOrmEntity(servicio)
            const savedEntity = await this.servicioRepository.save(ormEntity)

            return Result.success(ServicioMapper.toDomain(savedEntity))
        }
        catch(error){
            return Result.failure('Error al crear un servicio', error)

        }
    }
    // ✅ Listar todos los servicios activos
  async findAll(): Promise<Result<Servicio[]>> {
    try {
     const servicios = await this.servicioRepository.find({ where: { estado: EstadoServicio.ACTIVO } });
      return Result.success(servicios);
    } catch (error) {
      return Result.failure("Error al obtener los servicios: " + error.message);
    }
  }

  // ✅ Buscar por ID
  async findById(id: string): Promise<Result<Servicio>> {
    try {
      const servicioOrm = await this.servicioRepository.findOne({
        where: { id },
        relations: ["especialidad"],
      });

      if (!servicioOrm) return Result.failure("Servicio no encontrado");

      return Result.success(ServicioMapper.toDomain(servicioOrm));
    } catch (error) {
      return Result.failure("Error al buscar el servicio: " + error.message);
    }
  }

  async findByName(nombre: string): Promise<Result<Servicio>>{
    try{
        const entity = await this.servicioRepository.findOne({
            where: {nombre}
        });
        if(!entity){
            return Result.failure(`No se encontro un servicio con el nombre'${nombre}'.`)
        }
        return Result.success(ServicioMapper.toDomain(entity))
    } catch(error){
        return Result.failure('Error al buscar el servicio por nombre', error)
    }
    
  }

  async findByEspecialdad(id: string): Promise<Result<Servicio[]>> {
  try {
    const servicios = await this.servicioRepository.find({
      where: { 
        especialidad: { id },
        estado: EstadoServicio.ACTIVO
      },
      relations: ["especialidad"]
    });

    return Result.success(servicios.map(s => ServicioMapper.toDomain(s)));
  } catch (error) {
    return Result.failure("Error al obtener los servicios por especialidad", error);
  }
}


  // ✅ Actualizar servicio
  async update(
    id: string,
    nuevosDatos: Partial<Servicio>,
  ): Promise<Result<Servicio>> {
    try {
      const servicioOrm = await this.servicioRepository.findOne({ where: { id } });
      if (!servicioOrm) return Result.failure("Servicio no encontrado");

      Object.assign(servicioOrm, nuevosDatos);
      const updated = await this.servicioRepository.save(servicioOrm);

      return Result.success(ServicioMapper.toDomain(updated));
    } catch (error) {
      return Result.failure("Error al actualizar el servicio: " + error.message);
    }
  }

  // ✅ “Eliminar” servicio (Soft delete → estado INACTIVO)
  async delete(id: string): Promise<Result<Servicio>> {
    try {
      const servicioOrm = await this.servicioRepository.findOne({ where: { id } });
      if (!servicioOrm) return Result.failure("Servicio no encontrado");

      servicioOrm.estado = EstadoServicio.INACTIVO;
      const updated = await this.servicioRepository.save(servicioOrm);

      return Result.success(ServicioMapper.toDomain(updated));
    } catch (error) {
      return Result.failure("Error al eliminar el servicio: " + error.message);
    }
  }
    

    
    
}