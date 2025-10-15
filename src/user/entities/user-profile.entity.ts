import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Estados posibles para la relación usuario-perfil
 */
export enum UserProfileState {
  ACTIVE = 1, // Perfil activo
  INACTIVE = 0, // Perfil inactivo (soft delete)
  SUSPENDED = 2, // Perfil suspendido temporalmente
  EXPIRED = 3, // Perfil expirado (para perfiles temporales)
  PENDING = 4, // Pendiente de activación
  REVOKED = 5, // Revocado por admin
}

@Index('idx_user_profile_state', ['user_id', 'profile_id', 'state'])
@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Usuario al que se le asigna el perfil
   */
  @ManyToOne(() => User, (user) => user.userProfiles, {
    onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus asignaciones
    nullable: false,
    eager: false, // No cargar automáticamente el usuario
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  user_id: number;

  /**
   * Perfil asignado al usuario
   */
  @ManyToOne(() => Profile, (profile) => profile.userProfiles, {
    onDelete: 'RESTRICT', // No permitir eliminar perfiles que están asignados
    nullable: false,
    eager: false, // No cargar automáticamente el perfil
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'int' })
  profile_id: number;

  /**
   * Campos de control
   */
  @Column({
    type: 'smallint',
    default: UserProfileState.ACTIVE,
    comment: 'Estado del registro (1. activo, 0. inactivo, etc.)',
  })
  state: UserProfileState;

  @CreateDateColumn({
    comment: 'Fecha y hora de creación de la relación usuario-perfil',
  })
  created_at: Date;

  @UpdateDateColumn({
    comment:
      'Fecha y hora de última actualización de la relación usuario-perfil',
  })
  updated_at: Date;

  @Column('int', {
    nullable: true,
    comment: 'ID del usuario que creó la relación usuario-perfil',
  })
  created_by: number;

  @Column('int', {
    nullable: true,
    comment: 'ID del usuario que actualizó la relación usuario-perfil',
  })
  updated_by: number;
}
