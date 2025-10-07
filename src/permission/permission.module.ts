import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { CommonService } from 'src/common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, CommonService],
  imports: [TypeOrmModule.forFeature([Permission])],
  exports: [TypeOrmModule],
})
export class PermissionModule {}
