import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { CommonService } from 'src/common/common.service';
import { UserProfile } from './entities/user-profile.entity';
import { User } from 'src/user/entities/user.entity';
import { PermissionProfile } from './entities/permission-profile.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CommonService],
  imports: [
    TypeOrmModule.forFeature([Profile, UserProfile, User, PermissionProfile]),
  ],
  exports: [TypeOrmModule],
})
export class ProfileModule {}
