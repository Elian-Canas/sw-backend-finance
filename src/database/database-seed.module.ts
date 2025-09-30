import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserSeeder } from './seeds/user.seed';
import { DatabaseSeeder } from './seeds';
import { EncryptBcryptAdapter } from 'src/adapters/encrypt.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeeder, DatabaseSeeder, EncryptBcryptAdapter],
  exports: [DatabaseSeeder],
})
export class DatabaseSeedModule {}
