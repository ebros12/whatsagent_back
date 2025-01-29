import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Unique } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';

@Entity()
@Unique(['conversationID'])  // Asegura que el conversationID sea único
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;  // ID autoincrementable de la conversación

  @Column()
  nombre: string;

  @Column({ nullable: true })
  text: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true,type: 'int', unique: true, generated: 'increment' })
  conversationID: number;  

  @ManyToOne(() => User, (user) => user.conversations, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, (user) => user.assignedConversations, { nullable: true, onDelete: 'SET NULL' })
  agent: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
