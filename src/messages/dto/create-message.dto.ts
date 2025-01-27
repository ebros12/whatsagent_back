import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsInt()
  conversationId: number;

  @IsOptional()
  @IsInt()
  senderId?: number;  // El senderId es opcional
}
