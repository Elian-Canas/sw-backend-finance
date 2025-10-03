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
  INACTIVE = 2, // Perfil inactivo (soft delete)
  SUSPENDED = 3, // Perfil suspendido temporalmente
  EXPIRED = 4, // Perfil expirado (para perfiles temporales)
  PENDING = 5, // Pendiente de activación
  REVOKED = 6, // Revocado por admin
}

@Entity('profiles')
@Index(['state', 'name'])
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
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

  @Index()
  @Column({
    type: 'smallint',
    default: ProfileState.ACTIVE,
  })
  state: ProfileState;

  @Column('int', { nullable: true })
  parent_profile_id: number | null;

  @Column('varchar', { array: true, nullable: true, default: [] })
  cached_permissions: string[];

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
