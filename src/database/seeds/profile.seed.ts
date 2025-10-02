import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile, ProfileState } from 'src/profile/entities/profile.entity';

@Injectable()
export class ProfileSeeder {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async run(): Promise<void> {
    const baseProfiles = [
      {
        name: 'dev_admin',
        display_name: 'Developer Administrator',
        description: 'Administrator with full access',
        hierarchy_level: 1,
        state: ProfileState.ACTIVE,
        created_by: 1,
      },
      {
        name: 'admin',
        display_name: 'Administrator',
        description: 'Administrator with full access',
        hierarchy_level: 1,
        state: ProfileState.ACTIVE,
        created_by: 1,
      },
      {
        name: 'user',
        display_name: 'User',
        description: 'Regular user',
        hierarchy_level: 2,
        state: ProfileState.ACTIVE,
        created_by: 1,
      },
    ];

    for (const profileData of baseProfiles) {
      const existingProfile = await this.profileRepository.findOne({
        where: { name: profileData.name },
      });

      if (!existingProfile) {
        await this.profileRepository.save(profileData);
        console.log(`✅ Profile created: ${profileData.name}`);
      } else {
        console.log(`⏭️  Profile already exists: ${profileData.name}`);
      }
    }
  }
}
