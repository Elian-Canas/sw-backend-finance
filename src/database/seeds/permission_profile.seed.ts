import { InjectRepository } from '@nestjs/typeorm';
import { PermissionProfile } from 'src/profile/entities/permission-profile.entity';
import { Repository } from 'typeorm';
import {
  Permission,
  PermissionState,
} from 'src/permission/entities/permission.entity';

export class PermissionProfileSeeder {
  permission: any;

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionProfile)
    private readonly permissionProfileRepository: Repository<PermissionProfile>,
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
      created_by: number;
    }[] = [];

    // Asignar todos los permisos activos a los perfiles admin
    for (const [index, permissionId] of existingPermissionIds.entries()) {
      basePermissionProfiles.push(
        {
          profile_id: 1,
          permission_id: permissionId,
          created_by: 1,
        },
        {
          profile_id: 2,
          permission_id: permissionId,
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
