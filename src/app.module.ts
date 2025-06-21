import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { RolModule } from './modules/rol/rol.module';
import { PacienteModule } from './modules/paciente/paciente.module';
import { ColaboradorModule } from './modules/colaborador/colaborador.module';
import { CitaModule } from './modules/cita/cita.module';
import { PagoCitaModule } from './modules/pago-cita/pago-cita.module';



@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Usamos DATABASE_URL para que Render lo entienda directamente
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: true, // ⚠️ SOLO en desarrollo, NO en producción real
      }),
    }),

    // Resto de los módulos de tu app
    UsuarioModule,
    RolModule,
    PacienteModule,
    ColaboradorModule,
    CitaModule,
    PagoCitaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}