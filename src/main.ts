import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',  // Aquí le dices que acepte peticiones desde el frontend
    methods: 'GET,POST,PUT,DELETE',   // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization',  // Cabeceras permitidas
  });
  await app.listen(3000);
}
bootstrap();
