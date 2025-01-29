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

    let agent = null;
    if (createConversationDto.agentId !== null) {
      agent = await this.userRepository.findOne({ where: { id: createConversationDto.agentId } });
      if (!agent) {
        throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
      }
    }

    // Verificar si ya existe una conversación entre el usuario y el agente
    if (createConversationDto.agentId !== null) {
      const existingConversation = await this.conversationRepository.findOne({
        where: {
          user: { id: createConversationDto.userId },
          agent: { id: createConversationDto.agentId },
        },
      });

      if (existingConversation) {
        throw new HttpException('Conversation already exists for this user and agent', HttpStatus.BAD_REQUEST);
      }
    }

    // Crear una nueva conversación, permitiendo que el agente sea nulo
    const conversation = this.conversationRepository.create({
      ...createConversationDto,
      user,
      agent, // Si el agente es nulo, la propiedad se guarda como null
    });

    return this.conversationRepository.save(conversation);
  }

  // Asignar un agente a una conversación
  async assignAgentToConversation(conversationId: number, agentId: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['user'], // Relacionamos con el usuario para asegurarnos de que la conversación existe
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${conversationId} not found`);
    }

    // Verificamos que el agente exista
    const agent = await this.userRepository.findOne({ where: { id: agentId } });
    if (!agent) {
      throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }

    // Verificar que no haya una conversación ya asignada con este agente
    const existingConversation = await this.conversationRepository.findOne({
      where: {
        user: { id: conversation.user.id },
        agent: { id: agentId },
      },
    });

    if (existingConversation) {
      throw new HttpException('Conversation already exists for this user and agent', HttpStatus.BAD_REQUEST);
    }

    // Asignamos el agente a la conversación
    conversation.agent = agent;

    return this.conversationRepository.save(conversation);
  }
  // Método para obtener el tipo de usuario (Cliente o Agente)
  async getUserType(userId: number): Promise<'Cliente' | 'Agente'> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Aquí asumimos que la propiedad 'type' en la entidad User determina si es un Cliente o Agente
    return user.type_user === 'Cliente' ? 'Cliente' : 'Agente';
  }

  async findAllActive(userId: number): Promise<Conversation[]> {
    const userType = await this.getUserType(userId);  // Obtener el tipo de usuario

    if (userType === 'Cliente') {
      // Si es cliente, filtrar las conversaciones que le pertenecen
      return this.conversationRepository.find({
        where: { user: { id: userId } },  // Filtrar por el ID del usuario (cliente)
        relations: ['user', 'agent'], // Incluir las relaciones necesarias
      });
    } else {
      // Si es agente, filtrar las conversaciones que no tienen agente asignado
      return this.conversationRepository.find({
        where: { agent: null },  // Filtrar conversaciones donde 'agent' es null (no asignado)
        relations: ['user', 'agent'], // Incluir las relaciones necesarias
      });
    }
  }

  // Obtener una conversación por ID
  async findOne(id: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['user', 'agent', 'messages'],  // Incluir las relaciones necesarias
    });

    if (!conversation) {
      throw new Error(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  // Obtener todos los mensajes de una conversación
  async findMessagesByConversation(conversationId: number): Promise<Message[]> {
    const conversation = await this.findOne(conversationId);

    return conversation.messages;
  }

  // Registrar un mensaje en una conversación
  async addMessage(conversationId: number, createMessageDto: CreateMessageDto): Promise<Message> {
    const conversation = await this.findOne(conversationId);

    const message = this.messageRepository.create({
      ...createMessageDto,
      conversation,
    });

    return this.messageRepository.save(message);
  }
}
