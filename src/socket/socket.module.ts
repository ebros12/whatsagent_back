import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';


@Module({
  providers: [ChatGateway],
  exports: [ChatGateway],  // Exporta el ChatGateway para que se pueda usar en otros módulos
})
export class SocketModule {}
