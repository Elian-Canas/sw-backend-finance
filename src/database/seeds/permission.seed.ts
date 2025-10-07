import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Permission,
  PermissionState,
} from 'src/permission/entities/permission.entity';

@Injectable()
export class PermissionSeeder {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async run(): Promise<void> {
    const permissionsData = [
      /**
       * Grupo de permisos para el módulo de usuarios 1 - 6
       */
      {
        code: 'users.*',
        description: 'Modulo Usuario Acceso Total',
        module: 'user',
        action: 'all',
        is_group: true,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'users.write',
        description: 'Modulo Usuarios - Permite crear nuevos usuarios',
        module: 'user',
        action: 'write',
        parent_code: 'users.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'users.read',
        description:
          'Modulo Usuarios - Permite obtener la data de los usuarios',
        module: 'user',
        action: 'read',
        parent_code: 'users.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'users.update',
        description:
          'Modulo Usuarios - Permite actualizar la data de los usuarios',
        module: 'user',
        action: 'update',
        parent_code: 'users.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'users.change',
        description:
          'Modulo Usuarios - Permite cambiar el estado de los usuarios (activar, desactivar)',
        module: 'user',
        action: 'change',
        parent_code: 'users.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'users.change_password',
        description:
          'Modulo Usuarios - Permite cambiar la contraseña de los usuarios',
        module: 'user',
        action: 'change_password',
        parent_code: 'users.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },

      /**
       * Grupo de permisos para el módulo de perfiles 7 al 11
       */
      {
        code: 'profiles.*',
        description: 'Modulo Perfiles Acceso Total',
        module: 'profiles',
        action: 'all',
        is_group: true,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'profiles.write',
        description: 'Modulo Perfiles - Permite crear nuevos perfiles',
        module: 'profiles',
        action: 'write',
        parent_code: 'profiles.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'profiles.read',
        description:
          'Modulo Perfiles - Permite obtener la data de los perfiles',
        module: 'profiles',
        action: 'read',
        parent_code: 'profiles.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'profiles.update',
        description:
          'Modulo Perfiles - Permite actualizar la data de los perfiles',
        module: 'profiles',
        action: 'update',
        parent_code: 'profiles.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
      {
        code: 'profiles.change',
        description:
          'Modulo Perfiles - Permite cambiar el estado de los perfiles (activar, desactivar)',
        module: 'profiles',
        action: 'change',
        parent_code: 'profiles.*',
        is_group: false,
        state: PermissionState.ACTIVE,
        created_by: 1,
      },
    ];

    // Mapa para guardar el ID de cada permiso creado por su código
    this.permissionRepository.create(permissionsData);
    for (const permissionData of permissionsData) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { code: permissionData.code },
      });

      if (!existingPermission) {
        await this.permissionRepository.save(permissionData);
        console.log(`✅ Permission created: ${permissionData.code}`);
      } else {
        console.log(`⏭️  Permission already exists: ${permissionData.code}`);
      }
    }
  }
}
