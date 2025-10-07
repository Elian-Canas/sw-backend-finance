import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from '../user/entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { UserProfile } from 'src/profile/entities/user-profile.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { PermissionProfile } from 'src/profile/entities/permission-profile.entity';

// Seeders
import { UserSeeder } from './seeds/user.seed';
import { ProfileSeeder } from './seeds/profile.seed';
import { UserProfileSeeder } from './seeds/user_profile.seed';
import { PermissionSeeder } from './seeds/permission.seed';
import { PermissionProfileSeeder } from './seeds/permission_profile.seed';
import { DatabaseSeeder } from './seeds';

// Others
import { EncryptBcryptAdapter } from 'src/adapters/encrypt.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      UserProfile,
      Permission,
      PermissionProfile,
    ]),
  ],
  providers: [
    UserSeeder,
    ProfileSeeder,
    UserProfileSeeder,
    PermissionSeeder,
    PermissionProfileSeeder,
    DatabaseSeeder,
    EncryptBcryptAdapter,
  ],
  exports: [DatabaseSeeder],
})
export class DatabaseSeedModule {}
