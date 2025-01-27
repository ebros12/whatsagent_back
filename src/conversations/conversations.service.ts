// src/conversations/conversations.service.ts
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/messages/entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)  // Inyectar MessageRepository
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Crear una nueva conversación si no existe
  async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const user = await this.userRepository.findOne({ where: { id: createConversationDto.userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const agent = await this.userRepository.findOne({ where: { id: createConversationDto.agentId } });
    if (!agent) {
      throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }

    // Verificar si ya existe una conversación entre el usuario y el agente
    const existingConversation = await this.conversationRepository.findOne({
      where: {
        user: { id: createConversationDto.userId },
        agent: { id: createConversationDto.agentId },
      },
    });

    if (existingConversation) {
      throw new HttpException('Conversation already exists', HttpStatus.BAD_REQUEST);
    }

    // Crear una nueva conversación
    const conversation = this.conversationRepository.create({
      ...createConversationDto,
      user,
      agent,
    });

    return this.conversationRepository.save(conversation);
  }

  // Obtener todas las conversaciones activas
  async findAllActive(): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { status: 'active' }, 
      relations: ['user', 'agent'],
    });
  }

  // Obtener una conversación por ID
  async findOne(id: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['user', 'agent', 'messages'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  // Obtener todos los mensajes de una conversación
  async findMessagesByConversation(conversationId: number): Promise<Message[]> {
    const conversation = await this.findOne(conversationId); // Usamos el nuevo método findOne
    return conversation.messages;
  }

  // Registrar un mensaje en una conversación
  async addMessage(conversationId: number, createMessageDto: CreateMessageDto): Promise<Message> {
    const conversation = await this.findOne(conversationId); // Usamos el nuevo método findOne

    // Crear el mensaje y asociarlo con la conversación
    const message = this.messageRepository.create({
      ...createMessageDto,
      conversation,
    });

    return this.messageRepository.save(message);
  }
}
