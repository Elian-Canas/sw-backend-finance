import { UserProfile } from 'src/profile/entities/user-profile.entity';
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
  INACTIVE = 2, // Usuario inactivo (soft delete)
  SUSPENDED = 3, // Usuario suspendido temporalmente
  EXPIRED = 4, // Usuario expirado (para perfiles temporales)
  PENDING = 5, // Pendiente de activación
  REVOKED = 6, // Revocado por admin
}

@Entity('users')
@Index(['email', 'state'])
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

  // Relación uno a muchos con UserProfile
  @OneToMany(() => UserProfile, (userProfile) => userProfile.user)
  userProfiles: UserProfile[];

  @Column('varchar', { array: true, nullable: true, default: [] })
  cached_profiles: string[];

  @Column({
    type: 'smallint',
    default: UserState.ACTIVE,
  })
  state: UserState;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('int', { nullable: true })
  created_by: number;

  @Column('int', { nullable: true })
  updated_by: number;
}
