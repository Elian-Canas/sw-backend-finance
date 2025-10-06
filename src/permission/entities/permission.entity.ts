import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Estados posibles para el perfil
 */
export enum PermissionState {
  ACTIVE = 1, // Perfil activo
  INACTIVE = 2, // Perfil inactivo (soft delete)
  SUSPENDED = 3, // Perfil suspendido temporalmente
  EXPIRED = 4, // Perfil expirado (para perfiles temporales)
  PENDING = 5, // Pendiente de activación
  REVOKED = 6, // Revocado por admin
}

@Entity('permissions')
@Index(['module', 'action', 'state'])
export class Permission {
  @PrimaryGeneratedColumn()
  id: number; // Identificador único del permiso

  @Index({ unique: true })
  @Column('text', {
    unique: true,
    comment: 'Código único del permiso (para referencia interna)',
  })
  code: string;

  @Column('text', {
    comment: 'Nombre legible del permiso',
  })
  description: string;

  @Column('text', {
    comment: 'Módulo al que pertenece el permiso',
  })
  module: string;

  @Column('text', {
    comment: 'Submódulo al que pertenece el permiso',
  })
  submodule: string;

  @Column('text', {
    comment: 'Acción específica que permite este permiso',
  })
  action: string;

  @Column('text', {
    comment: 'Ámbito o alcance del permiso',
  })
  scope: string;

  @Column('text', {
    comment: 'ID del permiso padre (si aplica, para jerarquía)',
  })
  parent_id: string;

  @Column('boolean', {
    comment: 'Indica si el permiso es un grupo de permisos',
  })
  is_group: boolean;

  @Index()
  @Column('smallint', {
    default: PermissionState.ACTIVE,
    comment: 'Estado del permiso (activo, inactivo, etc.)',
  })
  state: number;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creación del permiso',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment: 'Fecha de última actualización del permiso',
  })
  updated_at: Date;

  @Column('int', { 
    nullable: true,
    comment: 'ID del usuario que creó el permiso',
  })
  created_by: number | null;

  @Column('int', { 
    nullable: true,
    comment: 'ID del usuario que actualizó el permiso por última vez',
  })
  updated_by: number | null;
}
