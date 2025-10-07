import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Estados posibles para el perfil
 */
export enum ProfileState {
  ACTIVE = 1, // Perfil activo
  INACTIVE = 0, // Perfil inactivo (soft delete)
  SUSPENDED = 2, // Perfil suspendido temporalmente
  EXPIRED = 3, // Perfil expirado (para perfiles temporales)
  PENDING = 4, // Pendiente de activación
  REVOKED = 5, // Revocado por admin
}

@Entity('profiles')
@Index(['state', 'name'])
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column('text', {
    unique: true,
    comment: 'Nombre único del perfil (para referencia interna)',
  })
  name: string;

  @Column('text', {
    comment: 'Nombre para mostrar del perfil',
  })
  display_name: string;

  @Column('text', {
    comment: 'Descripción del perfil',
  })
  description: string;

  @Column('int', {
    default: 0,
    comment: 'Nivel de jerarquía del perfil',
  })
  hierarchy_level: number;

  @Column({
    type: 'smallint',
    default: ProfileState.ACTIVE,
    comment: 'Estado del perfil (1. activo, 0. inactivo, etc.)',
  })
  state: ProfileState;

  @Column('int', { nullable: true })
  parent_profile_id: number | null;

  @Column('varchar', { array: true, nullable: true, default: [] })
  cached_permissions: string[];

  @CreateDateColumn({
    comment: 'Fecha y hora de creación del perfil',
  })
  created_at: Date;

  @UpdateDateColumn({
    comment: 'Fecha y hora de última actualización del perfil',
  })
  updated_at: Date;

  @Column('int', {
    nullable: true,
    comment: 'ID del usuario que creó el perfil',
  })
  created_by: number;

  @Column('int', {
    nullable: true,
    comment: 'ID del usuario que actualizó el perfil',
  })
  updated_by: number;
  userProfiles: any;
  permissionProfiles: any;
}
