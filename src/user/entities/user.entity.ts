import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  name: string;

  @Column('int', {
    default: 1,
  })
  state: number;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  profiles: string[];
}
