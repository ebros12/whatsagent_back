import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';  // Importa User

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' }) // Nombre de la columna que almacena el ID de la conversación
  conversation: Conversation;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAT: Date;

  @ManyToOne(() => User, { nullable: true })  // Relación con User (si es necesario)
  @JoinColumn({ name: 'senderId' })  // Puede ser null si el mensaje es automático o no tiene emisor
  sender: User;

  @Column({ nullable: true })
  senderId: number; // Puede ser el ID del cliente o el agente que envió el mensaje

  @Column({ nullable: true })
  agent: number; // Puede ser el ID del cliente o el agente que envió el mensaje
}
