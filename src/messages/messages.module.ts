import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { SocketModule } from '../socket/socket.module'; // Importa el SocketModule donde se encuentra ChatGateway

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    forwardRef(() => ConversationsModule),
    UsersModule,
    SocketModule, // Asegúrate de importar SocketModule para que ChatGateway esté disponible
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
