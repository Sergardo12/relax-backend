import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteModule } from './modules/paciente/paciente.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificacionModule } from './modules/notificacion/notificacion.module';
import { ProductoModule } from './modules/producto/producto.module';
import { ProveedorProductoModule } from './modules/proveedor-producto/proveedor-producto.module';
import { CompraProductoModule } from './modules/compra-producto/compra-producto.module';
import { VentaProductoModule } from './modules/venta-producto/venta-producto.module';
import { ProveedorInsumoModule } from './modules/proveedor-insumo/proveedor-insumo.module';
import { RegistroGastoModule } from './modules/registro-gasto/registro-gasto.module';
import { error } from 'console';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>{
      const databaseUrl = configService.get('DATABASE_URL');
      const nodeEnv = configService.get('NODE_ENV');
       if (databaseUrl) {
          // 🚀 PRODUCCIÓN (Render con Supabase)
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: nodeEnv !== 'production', // ⚠️ true en development, false en production
            ssl: { rejectUnauthorized: false },
            logging: nodeEnv === 'development' ? ['query', 'error'] : false, // Ver queries en dev
          };
        } else {
          // 💻 DESARROLLO (Local)
          return {
            type: 'postgres' as const,
            host: configService.get('DATABASE_HOST') || 'localhost',
            port: parseInt(configService.get('DATABASE_PORT') || '5432'),
            username: configService.get('DATABASE_USER') || 'postgres',
            password: configService.get('DATABASE_PASSWORD') || 'postgres',
            database: (configService.get('DATABASE_NAME') || 'relaxdb') as string, // ⭐ Agregar 'as string'
            autoLoadEntities: true,
            synchronize: true,
            ssl:false
          };
        }
      },
      inject:[ConfigService],
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
    ChatbotModule,
    NotificacionModule,
    ProductoModule,
    ProveedorProductoModule,
    CompraProductoModule,
    VentaProductoModule,
    ProveedorInsumoModule,
    RegistroGastoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
