import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { Message } from '../messages/entities/message.entity';
import { MessagesModule } from '../messages/messages.module';
import { SocketModule } from '../socket/socket.module';  // Importa el SocketModule aquí

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, User, Message]),
    MessagesModule,
    SocketModule,  // Asegúrate de que SocketModule esté importado
  ],
  providers: [ConversationsService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
