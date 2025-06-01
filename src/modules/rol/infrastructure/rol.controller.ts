import { Body, Controller, Post } from "@nestjs/common";
import { CrearRolUseCase } from "../application/use-cases/crear-rol.use-case";
import { CrearRolDto } from "./dto/crear-rol";


@Controller('rol')
export class RolController {
    constructor(
        private readonly crearRolUseCase: CrearRolUseCase,
        
    ){}

    @Post()
    async crearRol(@Body() dto: CrearRolDto  ){
        return await this.crearRolUseCase.execute(dto)
    }
}