import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePermission } from 'src/profile/entities/profile-permission.entity';
import { Repository } from 'typeorm';
import {
  Permission,
  PermissionState,
} from 'src/permission/entities/permission.entity';

export class ProfilePermissionSeeder {
  permission: any;

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(ProfilePermission)
    private readonly permissionProfileRepository: Repository<ProfilePermission>,
  ) {}

  async run(): Promise<void> {
    // Obtener todos los permisos activos
    const existingPermissions = await this.permissionRepository.find({
      where: {
        state: PermissionState.ACTIVE,
      },
      select: ['id'],
    });

    // Extraer solo los IDs de los permisos existentes
    const existingPermissionIds = existingPermissions.map(
      (permission) => permission.id,
    );

    // Definir la estructura base de basePermissionProfiles
    let basePermissionProfiles: {
      profile_id: number;
      permission_id: number;
      state: number;
      created_by: number;
    }[] = [];

    // Asignar todos los permisos activos a los perfiles admin
    for (const [index, permissionId] of existingPermissionIds.entries()) {
      basePermissionProfiles.push(
        {
          profile_id: 1,
          permission_id: permissionId,
          state: PermissionState.ACTIVE,
          created_by: 1,
        },
        {
          profile_id: 2,
          permission_id: permissionId,
          state: PermissionState.ACTIVE,
          created_by: 1,
        },
      );
      try {
        await this.permissionProfileRepository.save(basePermissionProfiles);
        console.log(`✅ PermissionProfiles created`);
      } catch (error) {
        console.error(`❌ Error creating PermissionProfiles: ${error.message}`);
      }
    }
  }
}
