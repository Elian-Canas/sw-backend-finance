import { BadRequestException, Injectable } from '@nestjs/common';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { Profile, ProfileState } from './entities/profile.entity';
import { DataSource, EntityManager, In } from 'typeorm';
import {
  Permission,
  PermissionState,
} from 'src/permission/entities/permission.entity';
import {
  ProfilePermission,
  ProfilePermissionState,
} from './entities/profile-permission.entity';

@Injectable()
export class ProfilePermissionsService {
  constructor(private readonly dataSource: DataSource) {}

  async managePermissionsToProfile(
    dto: AssignPermissionDto,
    profileId: number,
    userId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      // Verificar perfil existe y está activo
      const profile = await manager.findOne(Profile, {
        where: { id: profileId, state: ProfileState.ACTIVE },
      });

      if (!profile) {
        throw new BadRequestException('Profile not found');
      }

      // Verificar permisos existan y estén activos
      await this.validatePermissions(manager, dto.permissionIds);

      // Lógica para manejar la asignación de permisos
      switch (dto.action) {
        case 'add':
          await this.addPermissions(manager, profileId, dto, userId);
          break;
        case 'remove':
          // Eliminar permisos
          await this.removePermissions(manager, profileId, dto, userId);
          break;
      }

      // Actualizar caché
      await this.updateCachedPermissions(
        manager,
        profileId,
        dto.permissionGroups,
        userId,
        dto.action,
      );

      return { message: 'Permissions updated successfully' };
    });
  }

  private async addPermissions(
    manager: EntityManager,
    profileId: number,
    dto: AssignPermissionDto,
    userId: number,
  ): Promise<void> {
    try {
      const newPermissions = dto.permissionIds.map((permissionId) =>
        manager.create(ProfilePermission, {
          permission_id: permissionId,
          profile_id: profileId,
          state: ProfilePermissionState.ACTIVE,
          created_by: userId,
        }),
      );

      await manager.save(ProfilePermission, newPermissions);
    } catch (error) {
      throw new BadRequestException(
        'Error adding permissions - ProfilePermissionsService',
      );
    }
  }

  private async removePermissions(
    manager: EntityManager,
    profileId: number,
    dto: AssignPermissionDto,
    userId: number,
  ): Promise<void> {
    try {
      await manager.update(
        ProfilePermission,
        {
          profile_id: profileId,
          permission_id: In(dto.permissionIds),
          state: ProfilePermissionState.ACTIVE,
        },
        {
          state: ProfilePermissionState.INACTIVE,
          updated_by: userId,
          updated_at: () => 'CURRENT_TIMESTAMP',
        },
      );
    } catch (error) {
      throw new BadRequestException(
        'Error removing permissions - ProfilePermissionsService',
      );
    }
  }

  private async updateCachedPermissions(
    manager: EntityManager,
    profileId: number,
    permissionGroups: string[],
    userId: number,
    action: 'add' | 'remove',
  ) {
    try {
      const profile = await manager.findOne(Profile, {
        where: { id: profileId },
        select: ['cached_permissions'],
      });

      if (!profile) {
        throw new BadRequestException('Profile not found');
      }

      if (action === 'remove') {
        // Se filtran los permisos que se van a eliminar del array
        const updatedPermissions = profile.cached_permissions.filter(
          (perm) => !permissionGroups.includes(perm),
        );

        await manager.update(
          Profile,
          { id: profileId },
          {
            cached_permissions: updatedPermissions,
            updated_by: userId,
            updated_at: () => 'CURRENT_TIMESTAMP',
          },
        );
      } else if (action === 'add') {
        // Se crea un Set para evitar duplicados al agregar nuevos permisos
        const updatedSet = new Set([
          ...profile.cached_permissions,
          ...permissionGroups,
        ]);
        const updatedPermissions = Array.from(updatedSet);

        await manager.update(
          Profile,
          { id: profileId },
          {
            cached_permissions: updatedPermissions,
            updated_by: userId,
            updated_at: () => 'CURRENT_TIMESTAMP',
          },
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Error updating cached permissions - ProfilePermissionsService',
      );
    }
  }

  private async validatePermissions(
    manager: EntityManager,
    permissionIds: number[],
  ) {
    const count = await manager.count(Permission, {
      where: { id: In(permissionIds), state: PermissionState.ACTIVE },
    });

    if (count !== permissionIds.length) {
      throw new BadRequestException('Some permissions not found or inactive');
    }
  }
}
