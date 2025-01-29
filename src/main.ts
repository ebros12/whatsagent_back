import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS globalmente, incluyendo WebSockets
  app.enableCors({
    origin: 'http://localhost:4200',  // Permitir solicitudes desde el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeceras permitidas
    credentials: true,  // Permitir el envío de cookies/credenciales
  });

  // Configurar WebSocket para aceptar CORS
  app.useWebSocketAdapter(new (require('@nestjs/platform-socket.io').IoAdapter)(app));

  await app.listen(3000);
}

bootstrap();
