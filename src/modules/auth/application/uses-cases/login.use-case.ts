import { Inject, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ContraseñaService } from "../../../usuario/application/services/contraseña.service";
import { UsuarioRepository } from "../../../usuario/domain/repositories/usuario.repository";
import { USUARIO_REPOSITORY } from "../../../usuario/infrastructure/usuario.repository.token";
import { LoginDto } from "../../domain/dto/login.dto";

export class LoginUseCase{
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepository: UsuarioRepository,
        private readonly contraseñaService: ContraseñaService,
        private readonly jwtService: JwtService,
    ){}

    async ejecutar(dto: LoginDto): Promise<{access_token: string}>{
        const usuario = await this.usuarioRepository.findByCorreo(dto.correo);
        if(!usuario) throw new UnauthorizedException('Credenciales inválidas');

        const hash = usuario.getContraseña();

        const esValida = await this.contraseñaService.compararContraseñas(
        dto.contraseña,
        hash,
        );

        if (!esValida) {
        throw new UnauthorizedException("Credenciales inválidas");
        }

        const payload = {
        sub: usuario.getId(),
        correo: usuario.correo,
        rol: usuario.getRol().nombre, 
        };

        const token = await this.jwtService.signAsync(payload);
        return { access_token: token };

    }
}