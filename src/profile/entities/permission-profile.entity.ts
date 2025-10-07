import { Permission } from 'src/permission/entities/permission.entity';
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
import { Profile } from './profile.entity';

/**
 * Estados posibles para la relación permiso-perfil
 */
export enum PermissionProfileState {
  ACTIVE = 1, // Perfil activo
  INACTIVE = 0, // Perfil inactivo (soft delete)
  SUSPENDED = 2, // Perfil suspendido temporalmente
  EXPIRED = 3, // Perfil expirado (para perfiles temporales)
  PENDING = 4, // Pendiente de activación
  REVOKED = 5, // Revocado por admin
}

@Index('idx_permission_profile_state', ['permission_id', 'profile_id', 'state'])
@Entity('permission_profiles')
export class PermissionProfile {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Permiso al que se le asigna el perfil
   */
  @ManyToOne(() => Permission, (permission) => permission.permissionProfiles, {
    onDelete: 'CASCADE', // Si se elimina el permiso, se eliminan sus asignaciones
    nullable: false,
    eager: false, // No cargar automáticamente el permiso
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @Column({ type: 'int' })
  permission_id: number;

  /**
   * Perfil asignado al usuario
   */
  @ManyToOne(() => Profile, (profile) => profile.permissionProfiles, {
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
    default: PermissionProfileState.ACTIVE,
    comment: 'Estado del registro (1. activo, 0. inactivo, etc.)',
  })
  state: PermissionProfileState;

  @CreateDateColumn({
    comment: 'Fecha y hora de creación de la relación permiso-perfil',
  })
  created_at: Date;

  @UpdateDateColumn({
    comment:
      'Fecha y hora de última actualización de la relación permiso-perfil',
  })
  updated_at: Date;

  @Column('int', {
    nullable: true,
    comment: 'ID del usuario que creó la relación permiso-perfil',
  })
  created_by: number;

  @Column('int', {
    nullable: true,
    comment: 'ID del usuario que actualizó la relación permiso-perfil',
  })
  updated_by: number;
}
