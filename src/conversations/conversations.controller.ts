// src/conversations/conversations.controller.ts
import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/messages/entities/message.entity';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // Obtener todas las conversaciones activas
  @Get()
  async findAll(): Promise<Conversation[]> {
    return this.conversationsService.findAllActive();
  }

  // Crear una nueva conversación
  @Post()
  async create(@Body() createConversationDto: CreateConversationDto): Promise<Conversation> {
    return this.conversationsService.create(createConversationDto);
  }

  // Obtener los mensajes de una conversación
  @Get(':id/messages')
  async findMessages(@Param('id') id: number): Promise<Message[]> {
    const messages = await this.conversationsService.findMessagesByConversation(id);
    if (!messages) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return messages;
  }

  // Registrar un mensaje en una conversación
  @Post(':id/messages')
  async addMessage(
    @Param('id') id: number,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const conversation = await this.conversationsService.findOne(id);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return this.conversationsService.addMessage(id, createMessageDto);
  }
}
