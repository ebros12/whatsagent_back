// src/conversations/dto/create-conversation.dto.ts
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  nombre: string;

  @IsInt()
  userId: number; // ID del usuario (debería coincidir con el modelo de tu base de datos)

  @IsInt()
  agentId: number; // ID del agente (debería ser agregado aquí)

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  text: string;
}
