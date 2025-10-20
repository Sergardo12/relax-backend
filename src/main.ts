import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Spa - Sistema de Gestión')
    .setDescription('API REST para gestión de citas, pagos, colaboradores y tratamientos del spa')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Configuracion de cors
  app.enableCors({
    origin: 'http://localhost:3001', // esta es la url del frontend (nextJs)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders:['Content-Type', 'Authorization'],
  });

  // Validacion global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
  }),
)

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Backend corriendo en: http://localhost:3000');
}
bootstrap();
