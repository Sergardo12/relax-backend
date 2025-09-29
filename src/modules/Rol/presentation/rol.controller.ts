import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CrearRolUseCase } from "../application/uses-cases/CrearRol.use-case";
import { Rol } from "../domain/entities/rol.entity";
import { RolDto } from "../infrastructure/dto/rol.dto";

@Controller('roles')
export class RolController{
    constructor(
        private readonly crearRolUseCase : CrearRolUseCase,
    ){}

    @Post()
    async crearRol(@Body() dto: RolDto): Promise<Rol>{
        return await this.crearRolUseCase.ejecutar(dto);
    }
}