import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  nombre: string;

  @IsInt()
  userId: number; // ID del usuario (debería coincidir con el modelo de tu base de datos)

  @IsOptional()
  @IsInt()
  agentId: number | null;  // Ahora puede ser null

  @IsString()
  conversationID: number; // Debería ser un número

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  text: string;
}
