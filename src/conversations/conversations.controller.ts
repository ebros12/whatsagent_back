// src/conversations/conversations.controller.ts
import { Controller, Post, Body, Get, Param, NotFoundException, Patch, Put, Query } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/messages/entities/message.entity';
import { AssignAgentDto } from './dto/assign-agent.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // Obtener todas las conversaciones activas
  @Get()
  async findAll(@Query('id') userId: number): Promise<Conversation[]> {
    return this.conversationsService.findAllActive(userId);
  }
  // Crear una nueva conversación
  @Post()
  async create(@Body() createConversationDto: CreateConversationDto): Promise<Conversation> {
    return this.conversationsService.create(createConversationDto);
  }

  // Obtener los mensajes de una conversación
// src/conversations/conversations.controller.ts
@Get(':id/messages')
async findMessages(@Param('id') id: number): Promise<any> {
  // Obtener los mensajes de la conversación
  const conversation = await this.conversationsService.findOne(id);

  if (!conversation) {
    throw new NotFoundException(`Conversation with ID ${id} not found`);
  }

  // Retornar los mensajes y el conversationId (id de la conversación)
  const messagesWithConversationId = conversation.messages.map(message => ({
    conversationId: conversation.id, // Agregar el conversationId
    ...message,
  }));

  return messagesWithConversationId;
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

    // Asignar un agente a una conversación
    @Put(':conversationId/assign-agent')
    async assignAgent(
      @Param('conversationId') conversationId: number,
      @Body() assignAgentDto: AssignAgentDto,
    ) {
      return this.conversationsService.assignAgentToConversation(
        conversationId,
        assignAgentDto.agentId,
      );
    }
}
