import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configuración de CORS
  // Permitir solicitudes desde cualquier origen, puedes ajustar esto según tus necesidades
  app.enableCors({
    origin: '*', // Permitir todas las solicitudes CORS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Accept', // Encabezados permitidos
    credentials: true, // Permitir credenciales (cookies, autenticación HTTP, etc.)
  });

  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no permitidas
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
    transform: true, // Transforma los datos entrantes a sus tipos correspondientes
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
