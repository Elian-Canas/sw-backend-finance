import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Profile } from './entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { UserProfile } from '../user/entities/user-profile.entity';
import { ProfilePermission } from './entities/profile-permission.entity';

// Services
import { CommonService } from 'src/common/common.service';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfilePermissionsService } from './profile-permissions.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CommonService, ProfilePermissionsService],
  imports: [
    TypeOrmModule.forFeature([Profile, UserProfile, User, ProfilePermission]),
  ],
  exports: [TypeOrmModule],
})
export class ProfileModule {}
