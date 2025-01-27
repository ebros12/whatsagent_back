// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt'; // Necesario para la creación de tokens JWT

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService, // Inyectamos el servicio de JWT
  ) {}

  // Crear un usuario con la contraseña encriptada
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Encriptamos la contraseña
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Obtener un usuario por su ID
  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Actualizar la información del usuario
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  // Eliminar un usuario
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

// src/users/users.service.ts
async validateUser(email: string, password: string): Promise<any> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) {
    return null;
  }

  // Asegúrate de que `user.password` es un string y la contraseña también lo sea.
  if (typeof user.password !== 'string') {
    throw new Error('Password in database is not a valid string');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password); // Validar la contraseña
  if (!isPasswordValid) {
    return null;
  }

  const { password: _password, ...result } = user; // Renombramos 'password' a '_password'
  return result;
}


  // Generar el token JWT para el usuario
  async login(user: any) {
    const payload = { email: user.email, sub: user.id }; // Cargar los datos que quieres en el payload
    return {
      access_token: this.jwtService.sign(payload), // Generar el token
    };
  }
}
