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
    //ConfigModule lee el archivo .env

    ConfigModule.forRoot({
      isGlobal: true
    }),

    //TypeOrmModule se configura con las variables de entorno
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuarioModule,
    RolModule,
    PacienteModule,
    ColaboradorModule,
    CitaModule,
    PagoCitaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}