import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { EncryptBcryptAdapter } from 'src/adapters/encrypt.adapter';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, EncryptBcryptAdapter, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('JWT_SECRET', configService.get('JWT_SECRET'));
        console.log('JWT_EXPIRES_IN', configService.get('JWT_EXPIRES_IN'));
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
