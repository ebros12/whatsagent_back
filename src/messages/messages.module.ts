// src/messages/messages.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { ConversationsModule } from '../conversations/conversations.module'; // Importa ConversationsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    forwardRef(() => ConversationsModule), // Envuelve ConversationsModule en forwardRef()
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
