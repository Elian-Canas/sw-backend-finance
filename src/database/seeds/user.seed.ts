import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserState } from '../../user/entities/user.entity';
import { EncryptBcryptAdapter } from 'src/adapters/encrypt.adapter';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encryptAdapter: EncryptBcryptAdapter,
  ) {}

  async run(): Promise<void> {
    const baseUsers = [
      {
        email: 'swnotionfreelance@gmail.com',
        password: await this.encryptAdapter.encrypt('ElSan123*'),
        first_name: 'Admin User',
        state: UserState.ACTIVE,
        cached_profiles: ['admin', 'dev_admin'],
      },
      {
        email: 'mariaabonilla11@hotmail.com',
        password: await this.encryptAdapter.encrypt('User123!'),
        first_name: 'Regular User',
        state: UserState.ACTIVE,
        cached_profiles: ['user'],
      },
    ];

    for (const userData of baseUsers) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        await this.userRepository.save(userData);
        console.log(`✅ User created: ${userData.email}`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }
  }
}
