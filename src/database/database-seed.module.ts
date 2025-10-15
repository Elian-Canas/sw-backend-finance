import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from '../user/entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { UserProfile } from 'src/user/entities/user-profile.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { ProfilePermission } from 'src/profile/entities/profile-permission.entity';

// Seeders
import { UserSeeder } from './seeds/user.seed';
import { ProfileSeeder } from './seeds/profile.seed';
import { UserProfileSeeder } from './seeds/user_profile.seed';
import { PermissionSeeder } from './seeds/permission.seed';
import { ProfilePermissionSeeder } from './seeds/profile_permission.seed';
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
      ProfilePermission,
    ]),
  ],
  providers: [
    UserSeeder,
    ProfileSeeder,
    UserProfileSeeder,
    PermissionSeeder,
    ProfilePermissionSeeder,
    DatabaseSeeder,
    EncryptBcryptAdapter,
  ],
  exports: [DatabaseSeeder],
})
export class DatabaseSeedModule {}
