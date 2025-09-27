import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { EncryptBcryptAdapter } from 'src/adapters/encrypt.adapter';

@Module({
  controllers: [UserController],
  providers: [UserService, EncryptBcryptAdapter],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class UserModule {}
