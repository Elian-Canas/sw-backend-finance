import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { CommonService } from 'src/common/common.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CommonService],
  imports: [TypeOrmModule.forFeature([Profile])],
  exports: [TypeOrmModule],
})
export class ProfileModule {}
