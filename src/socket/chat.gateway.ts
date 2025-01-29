import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  private messages: { channel: string; user: string; message: string }[] = [];

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Unirse a un canal
  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, channel: string) {
    client.join(channel);
    console.log(`${client.id} se unió al canal: ${channel}`);
    
    // Enviar el historial del canal
    const channelMessages = this.messages.filter(msg => msg.channel === channel);
    
    client.emit('messageHistory', channelMessages);
  }

  // Enviar un mensaje a un canal
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { channel: string; user: string; message: string }) {
    console.log(`Mensaje recibido de ${data.user}: ${data.message} en el canal ${data.channel}`);

    // Guardar el mensaje
    this.messages.push(data);

    // Emitir el mensaje SOLO al canal especificado
    this.server.to(data.channel).emit('message', data);
  }
}



