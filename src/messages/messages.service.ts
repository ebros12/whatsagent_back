import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { User } from '../users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { content, conversationId, senderId } = createMessageDto;

    // Buscar la conversación y el usuario, lanzando error si no existen
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) throw new NotFoundException('Conversation not found');

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) throw new NotFoundException('Sender not found');

    // Crear el mensaje
    const message = this.messageRepository.create({
      content,
      conversation,
      sender,
    });

    return await this.messageRepository.save(message);
  }
}
