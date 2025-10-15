import { UserProfile } from 'src/user/entities/user-profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

/**
 * Estados posibles para el usuario
 */
export enum UserState {
  ACTIVE = 1, // Usuario activo
  INACTIVE = 0, // Usuario inactivo (soft delete)
  SUSPENDED = 2, // Usuario suspendido temporalmente
  EXPIRED = 3, // Usuario expirado (para perfiles temporales)
  PENDING = 4, // Pendiente de activación
  REVOKED = 5, // Revocado por admin
}

@Entity('users')
@Index(['email', 'state'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
    comment: 'Correo electrónico del único del usuario',
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text', {
    nullable: true,
    comment: 'Nombre(s) del usuario',
  })
  first_name: string;

  @Column('text', {
    nullable: true,
    comment: 'Apellido(s) del usuario',
  })
  last_name: string;

  // Relación uno a muchos con UserProfile
  @OneToMany(() => UserProfile, (userProfile) => userProfile.user)
  userProfiles: UserProfile[];

  @Column('varchar', { array: true, nullable: true, default: [] })
  cached_profiles: string[];

  @Column({
    type: 'smallint',
    default: UserState.ACTIVE,
    comment: 'Estado del usuario (1. activo, 0. inactivo, etc.)',
  })
  state: UserState;

  @CreateDateColumn({
    comment: 'Fecha de creación del usuario',
  })
  created_at: Date;

  @UpdateDateColumn({
    comment: 'Fecha de última actualización del usuario',
  })
  updated_at: Date;

  @Column('int', {
    nullable: true,
    comment: 'ID del usuario que creó este registro',
  })
  created_by: number;

  @Column('int', {
    nullable: true,
    comment: 'ID del usuario que actualizó este registro',
  })
  updated_by: number;
}
