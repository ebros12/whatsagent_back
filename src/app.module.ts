import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ConversationsModule } from './conversations/conversations.module';
import { Conversation } from './conversations/entities/conversation.entity';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { ChatGateway } from './socket/chat.gateway';

dotenv.config();  // Cargar las variables de entorno

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',  // Cambiar a 'mysql' si usas MySQL
      host: process.env.HOST,
      port: +process.env.PORT, // Cambiar a 3306 si usas MySQL
      username: process.env.USER,
      password: process.env.PASS, // Usa variables de entorno si es posible
      database: process.env.DB,
      entities: [User, Conversation, Message],
      synchronize: process.env.NODE_ENV !== 'production',  // Desactivar en producción
    }),
    UsersModule,
    ConversationsModule,
    MessagesModule,
    ChatGateway,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,  // Usar la variable de entorno
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
