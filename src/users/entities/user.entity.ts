import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Conversation } from 'src/conversations/entities/conversation.entity';

@Entity()
@Unique(['email'])  // Asegura que el email sea único a nivel de base de datos
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  lastname: string;

  @Column()
  rut: string;

  @Column()
  email: string; // Esta columna tendrá una restricción de unicidad 

  @Column({ nullable: true })
  password: string; // Almacenamos la contraseña cifrada

  @Column({ nullable: true })
  type_user: string; // Puede ser "cliente" o "agente"

  @Column()
  status: string; // Puede ser "activo", "inactivo", etc.

  // Relación OneToMany: Un usuario puede tener muchas conversaciones como cliente
  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations: Conversation[];

  // Relación OneToMany: Un agente puede tener muchas conversaciones asignadas
  @OneToMany(() => Conversation, (conversation) => conversation.agent)
  assignedConversations: Conversation[]; 
}
