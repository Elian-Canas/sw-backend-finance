import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserProfile,
  UserProfileState,
} from 'src/user-profile/entities/user-profile.entity';

export class UserProfileSeeder {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async run(): Promise<void> {
    const baseUserProfiles = [
      {
        user_id: 1,
        profile_id: 1,
        state: UserProfileState.ACTIVE,
      },
      {
        user_id: 1,
        profile_id: 2,
        state: UserProfileState.ACTIVE,
      },
      {
        user_id: 2,
        profile_id: 3,
        state: UserProfileState.ACTIVE,
      },
    ];

    for (const userProfileData of baseUserProfiles) {
      const existingUserProfile = await this.userProfileRepository.findOne({
        where: {
          user_id: userProfileData.user_id,
          profile_id: userProfileData.profile_id,
        },
      });

      if (!existingUserProfile) {
        await this.userProfileRepository.save(userProfileData);
        console.log(`✅ UserProfile created`);
      } else {
        console.log(
          `⏭️  UserProfile already exists: ${JSON.stringify(userProfileData)}`,
        );
      }
    }
  }
}
