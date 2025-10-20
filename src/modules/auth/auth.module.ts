import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./presentation/auth.controller";
import { LoginUseCase } from "./application/uses-cases/login.use-case";
import { CrearUsuarioPacienteUseCase } from "../usuario/application/uses-cases/crearUsuarioPaciente.use-case";
import { UsuarioRepositoryImpl } from "../usuario/infrastructure/repositories/usuario.repository.impl";
import { USUARIO_REPOSITORY } from "../usuario/infrastructure/usuario.repository.token"
import { JwtStrategy } from "./application/strategies/jwt.strategy";
import { ContraseñaService } from "../usuario/application/services/contraseña.service";
import { RolModule } from "../rol/rol.module"
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioOrmEntity } from "../usuario/infrastructure/database/usuario-entity.orm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CrearUsuarioColaboradorUseCase } from "../usuario/application/uses-cases/crear-usuario-colaborador";
import { PacienteModule } from "../paciente/paciente.module";
import { ColaboradorModule } from "../colaborador/colaborador.module";
import { ObtenerCitaPorIdUseCase } from "../cita/application/use-cases/obtener-cita-por-id.use-case";



@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h' },
            }),
        }),
        RolModule,
        TypeOrmModule.forFeature([UsuarioOrmEntity]),
        PacienteModule,
        ColaboradorModule,
    ],
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        CrearUsuarioPacienteUseCase,
        CrearUsuarioColaboradorUseCase,
        ContraseñaService,
        

        {
            provide: USUARIO_REPOSITORY,
            useClass: UsuarioRepositoryImpl, 

        },
        JwtStrategy
        
    ],
    exports: [PassportModule, JwtModule],
})
export class AuthModule {}