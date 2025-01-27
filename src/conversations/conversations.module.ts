// src/conversations/conversations.module.ts
import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { Message } from '../messages/entities/message.entity';  // Asegúrate de importar la entidad Message si no lo has hecho
import { MessagesModule } from '../messages/messages.module'; // Importamos el MessagesModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, User, Message]), // Asegúrate de que Message esté en la lista
    MessagesModule, // Importamos MessagesModule para que MessageRepository esté disponible
  ],
  providers: [ConversationsService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
