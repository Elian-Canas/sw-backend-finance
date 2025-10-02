import { Injectable } from '@nestjs/common';
import { UserSeeder } from './user.seed';
import { ProfileSeeder } from './profile.seed';
import { UserProfileSeeder } from './user_profile.seed';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly profileSeeder: ProfileSeeder,
    private readonly userProfileSeeder: UserProfileSeeder,
  ) {}

  async run(): Promise<void> {
    console.log('🌱 Starting database seeds...\n');

    // Ejecutar seeders en orden
    await this.profileSeeder.run();
    await this.userSeeder.run();
    await this.userProfileSeeder.run();

    // Aquí puedes agregar más seeders en el orden que necesites
    // await this.permissionSeeder.run();
    // await this.roleSeeder.run();

    console.log('\n✅ All seeds completed successfully');
  }
}
