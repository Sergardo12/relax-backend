import { Body, Controller, Post } from "@nestjs/common";
import { CrearUsuarioUseCase } from "../application/uses-cases/crearUsuario.use-case";
import { CrearUsuarioDTO } from "../infrastructure/dto/crearUsuario.dto";

@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly crearUsuarioUseCase: CrearUsuarioUseCase

    ){}

    @Post()
    async crearUsuario(@Body() dto: CrearUsuarioDTO){
        return this.crearUsuarioUseCase.ejecutar(dto);
    }
}