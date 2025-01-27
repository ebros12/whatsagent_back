import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity'; // Ajusta la ruta si es necesario
import { CreateMessageDto } from './dto/create-message.dto'; // Importa el DTO

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
  ) {}

  // Ahora esperamos el DTO completo
  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { content, conversationId, senderId } = createMessageDto;

    // Buscar la conversación asociada al conversationId
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });

    // Si no se encuentra la conversación, podemos lanzar un error o manejarlo como corresponda
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Crear el mensaje con los datos del DTO
    const message = this.messageRepository.create({
      content,
      conversation,
      senderId, // Asignamos el senderId si está presente
    });

    // Guardar el mensaje en la base de datos
    return this.messageRepository.save(message);
  }
}
