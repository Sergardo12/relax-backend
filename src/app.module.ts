import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteModule } from './modules/paciente/paciente.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EspecialidadModule } from './modules/especialidad/especialidad.module';
import { ColaboradorModule } from './modules/colaborador/colaborador.module';
import { ServicioModule } from './modules/servicio/servicio.module';
import { CitaModule } from './modules/cita/cita.module';
import { DetalleCitaModule } from './modules/detalle-cita/detalle-cita.module';
import { HorarioColaboradorModule } from './modules/horario-colaborador/horario-colaborador.module';
import { PagoCitaModule } from './modules/pago-cita/pago-cita.module';
import { TratamientoModule } from './modules/tratamiento/tratamiento.module';
import { SesionTratamientoModule } from './modules/sesion-tratamiento/sesion-tratamiento.module';
import { MembresiaModule } from './modules/membresia/membresia.module';
import { SuscripcionModule } from './modules/suscripcion/suscripcion.module';
import { PagoSuscripcionModule } from './modules/pago-suscripcion/pago-suscripcion.module';
import { BeneficioMembresianModule } from './modules/beneficio-membresia/beneficio-membresia.module';
import { ConsumoBeneficioModule } from './modules/consumo-beneficio/consumo-beneficio.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { RolModule } from './modules/rol/rol.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'relaxdb',
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo, en producción usar migraciones
    }),
    AuthModule,
    RolModule,
    UsuarioModule,
    PacienteModule,
    EspecialidadModule,
    ColaboradorModule,
    ServicioModule,
    CitaModule,
    DetalleCitaModule,
    HorarioColaboradorModule,
    PagoCitaModule,
    TratamientoModule,
    SesionTratamientoModule,
    MembresiaModule,
    BeneficioMembresianModule,
    SuscripcionModule,
    ConsumoBeneficioModule,
    PagoSuscripcionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
