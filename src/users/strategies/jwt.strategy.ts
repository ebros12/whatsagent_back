// src/users/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service'; // Importamos el servicio de Usuarios

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // La misma clave utilizada para firmar el token
    });
  }

  async validate(payload: any) {
    return this.usersService.findOne(payload.sub); // Devuelve el usuario con el id del payload
  }
}
