import { Injectable } from '@nestjs/common';
import { UserSeeder } from './user.seed';

@Injectable()
export class DatabaseSeeder {
  constructor(private readonly userSeeder: UserSeeder) {}

  async run(): Promise<void> {
    console.log('🌱 Starting database seeds...\n');

    // Ejecutar seeders en orden
    await this.userSeeder.run();

    // Aquí puedes agregar más seeders en el orden que necesites
    // await this.permissionSeeder.run();
    // await this.roleSeeder.run();

    console.log('\n✅ All seeds completed successfully');
  }
}