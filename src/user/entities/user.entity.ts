import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text', { nullable: true })
  first_name: string;

  @Column('text', { nullable: true })
  last_name: string;

  @Column('int', {
    default: 1,
  })
  state: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('int', { nullable: true })
  created_by: number;

  @Column('int', { nullable: true })
  updated_by: number;
}
