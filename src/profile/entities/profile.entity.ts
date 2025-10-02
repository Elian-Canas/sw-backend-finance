import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Estados posibles para el perfil
 */
export enum ProfileState {
  ACTIVE = 1, // Perfil activo
  INACTIVE = 2, // Perfil inactivo (soft delete)
  SUSPENDED = 3, // Perfil suspendido temporalmente
  EXPIRED = 4, // Perfil expirado (para perfiles temporales)
  PENDING = 5, // Pendiente de activación
  REVOKED = 6, // Revocado por admin
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text')
  display_name: string;

  @Column('text')
  description: string;

  @Column('int', {
    default: 0,
  })
  hierarchy_level: number;

  @Column({
    type: 'smallint',
    default: ProfileState.ACTIVE,
  })
  state: ProfileState;

  @Column('int', { nullable: true })
  parent_profile_id: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('int', { nullable: true })
  created_by: number;

  @Column('int', { nullable: true })
  updated_by: number;
  userProfiles: any;
}
