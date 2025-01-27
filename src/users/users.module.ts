// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';  // Importa JwtModule
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Registra la entidad User
    JwtModule.register({
      secret: 'secretKey', // Cambia esto por una clave segura
      signOptions: { expiresIn: '1h' }, // El token expirará en 1 hora
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy], // Agregar la estrategia JWT
  exports: [UsersService], // Exporta el servicio si lo necesitas en otros módulos
})
export class UsersModule {}
