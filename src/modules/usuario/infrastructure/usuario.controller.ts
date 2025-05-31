import { Body, Controller, Post } from "@nestjs/common";
import { CrearUsuarioUseCase } from "../application/use-cases/crear-usuario.use-case";
import { CrearUsuarioDto } from "./dto/crear-usuario";


@Controller('usuario')
export class UsuarioController {
    constructor(private readonly crearUsuarioUseCase: CrearUsuarioUseCase) {}

    @Post()
    async crearUsuario(@Body() dto: CrearUsuarioDto) {
        return await this.crearUsuarioUseCase.execute(dto);
    }
}

//localhost:3000/usuario

//[HttpPost] 