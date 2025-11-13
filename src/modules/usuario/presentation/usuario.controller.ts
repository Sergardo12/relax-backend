import { Body, Controller, Get, Inject, NotFoundException, Post, UseGuards } from "@nestjs/common";
import { CrearUsuarioUseCase } from "../application/uses-cases/crearUsuario.use-case";
import { AuthGuard } from "@nestjs/passport";
import { UsuarioActual } from "../../auth/presentation/decorators/usuario-actual.decorator";
import { RolesGuard } from "../../auth/presentation/guards/roles.guard";
import { Roles } from "../../auth/presentation/decorators/roles.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CrearUsuarioDTO } from "../infrastructure/dto/crearUsuario.dto";
import { USUARIO_REPOSITORY } from "../infrastructure/usuario.repository.token";
import { UsuarioRepository } from "../domain/repositories/usuario.repository";

@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly crearUsuarioUseCase: CrearUsuarioUseCase,
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: UsuarioRepository,

    ){}

    //Estwe metodo es generico para crear un usuario dandole cualquier rol

    @Post()
    async crearUsuario(@Body() dto: CrearUsuarioDTO){
        return this.crearUsuarioUseCase.ejecutar(dto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('administrador')
    @Get()
    async findAllUsers() {
        return await this.usuarioRepo.findAll();
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'))
    @Get('perfil')
    async findUserById(@UsuarioActual('sub') id: string) {
        const usuario = await this.usuarioRepo.findById(id);
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }
        const rolNombre = usuario.getRol().nombre;

        const perfil: any = {
            id: usuario.getId(),
            correo: usuario.correo,
            rol: {
                id: usuario.getRol().getId(),
                nombre: rolNombre,
            },
            perfilCompleto: usuario.getPerfilCompleto(),
        };

        return perfil;
    }
}