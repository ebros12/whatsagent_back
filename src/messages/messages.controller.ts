import { Controller, Post, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto'; // Asegúrate de importar el DTO

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    // Pasamos el DTO completo al servicio
    return this.messagesService.createMessage(createMessageDto);
  }
}
