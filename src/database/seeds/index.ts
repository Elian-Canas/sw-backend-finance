import { Injectable } from '@nestjs/common';
import { UserSeeder } from './user.seed';
import { ProfileSeeder } from './profile.seed';
import { UserProfileSeeder } from './user_profile.seed';
import { PermissionSeeder } from './permission.seed';
import { ProfilePermissionSeeder } from './profile_permission.seed';

type SeederName =
  | 'user'
  | 'profile'
  | 'user-profile'
  | 'permission'
  | 'profile-permission';

@Injectable()
export class DatabaseSeeder {
  private seeders: Record<SeederName, any>;

  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly profileSeeder: ProfileSeeder,
    private readonly userProfileSeeder: UserProfileSeeder,
    private readonly permissionSeeder: PermissionSeeder,
    private readonly permissionProfileSeeder: ProfilePermissionSeeder,
  ) {
    // Mapa de seeders disponibles
    this.seeders = {
      profile: this.profileSeeder,
      user: this.userSeeder,
      'user-profile': this.userProfileSeeder,
      permission: this.permissionSeeder,
      'profile-permission': this.permissionProfileSeeder,
      // Agregar más seeders aquí
    };
  }

  async run(seederName?: string): Promise<void> {
    if (seederName) {
      await this.runSpecific(seederName);
    } else {
      await this.runAll();
    }
  }

  private async runSpecific(seederName: string): Promise<void> {
    console.log(`🌱 Running specific seeder: ${seederName}\n`);

    const seeder = this.seeders[seederName as SeederName];

    if (!seeder) {
      console.error(`❌ Seeder "${seederName}" not found`);
      console.log(
        `\nAvailable seeders: ${Object.keys(this.seeders).join(', ')}`,
      );
      throw new Error(`Seeder "${seederName}" not found`);
    }

    await seeder.run();
    console.log(`\n✅ Seeder "${seederName}" completed successfully`);
  }

  private async runAll(): Promise<void> {
    console.log('🌱 Starting all database seeds...\n');

    // Ejecutar seeders en orden específico
    await this.profileSeeder.run();
    await this.userSeeder.run();
    await this.userProfileSeeder.run();
    await this.permissionSeeder.run();
    await this.permissionProfileSeeder.run();
    // Aquí puedes agregar más seeders en el orden que necesites

    console.log('\n✅ All seeds completed successfully');
  }

  /**
   * Lista todos los seeders disponibles
   */
  listSeeders(): string[] {
    return Object.keys(this.seeders);
  }
}
