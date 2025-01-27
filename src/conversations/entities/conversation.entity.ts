import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Relación con el cliente (usuario que crea la conversación)
  @ManyToOne(() => User, (user) => user.conversations, { eager: true })  // Usando 'user.conversations'
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relación con los mensajes de la conversación
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  // Fecha de creación (automática cuando se crea la conversación)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , nullable: true })
  createAT?: Date;  // Asegúrate de que 'createAT' tenga un valor por defecto

  // Fecha de la última actualización (automática en cada modificación)
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAT?: Date;

  // Texto de la conversación
  @Column()
  text: string;

  // Estado de la conversación
  @Column()
  status: string;

  // Relación con el agente (opcional si la conversación está siendo atendida por un agente)
  @ManyToOne(() => User, { nullable: true }) // El agente es un usuario y esta relación es opcional
  @JoinColumn({ name: 'agentId' })
  agent?: User; // Puede ser nulo si la conversación aún no tiene un agente asignado
}
