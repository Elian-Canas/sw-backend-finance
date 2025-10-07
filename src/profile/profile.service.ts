import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, ProfileState } from './entities/profile.entity';
import { CommonService } from 'src/common/common.service';
import { UserProfile } from './entities/user-profile.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonService: CommonService,
  ) {}

  async create(createProfileDto: CreateProfileDto, userId: number) {
    try {
      const profile = this.profileRepository.create({
        ...createProfileDto,
        created_by: userId ?? null,
      });

      await this.profileRepository.save(profile);
      return profile;
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  async findAll() {
    try {
      const profiles = await this.profileRepository.find({
        where: { state: ProfileState.ACTIVE },
      });
      return profiles;
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto, userId: number) {
    try {
      await this.profileRepository.update(id, {
        ...updateProfileDto,
        updated_by: userId,
      });
      return this.profileRepository.findOne({ where: { id } });
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

  async setState(id: number, state: ProfileState, userId: number) {
    try {
      await this.profileRepository.update(id, { state, updated_by: userId });
      const userProfiles = await this.userProfileRepository.find({
        where: { profile_id: id },
      });

      if (state === ProfileState.INACTIVE) {
        await Promise.all(
          userProfiles.map((userProfile) =>
            this.updateUserProfileState(userProfile.id, state, userId),
          ),
        );
      }

      return {
        message: `Profile ${state === 1 ? 'activated' : 'inactivated'} successfully`,
      };
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }

  async updateUserProfileState(id: number, state: number, userId: number) {
    try {
      // Obtener el UserProfile con su relación al Profile
      const userProfile = await this.userProfileRepository.findOne({
        where: { id },
        relations: ['profile', 'user'],
      });

      if (!userProfile) {
        throw new BadRequestException('User profile not found');
      }

      // Actualizar el estado del UserProfile
      await this.userProfileRepository.update(id, {
        state,
        updated_by: userId,
      });

      // Actualizar el array cached_profiles del usuario según el estado
      if (userProfile.profile) {
        const user = await this.userRepository.findOne({
          where: { id: userProfile.user_id },
        });

        if (user) {
          let updatedProfiles = user.cached_profiles || [];

          if (state === 1) {
            // Si se activa el perfil, agregarlo si no está ya en el array
            if (!updatedProfiles.includes(userProfile.profile.name)) {
              updatedProfiles.push(userProfile.profile.name);
            }
          } else {
            // Si se inactiva el perfil, removerlo del array
            updatedProfiles = updatedProfiles.filter(
              (profileName) => profileName !== userProfile.profile.name,
            );
          }

          await this.userRepository.update(userProfile.user_id, {
            cached_profiles: updatedProfiles,
          });
        }
      }

      return {
        message: `User ${state === 1 ? 'activated' : 'inactivated'} successfully`,
      };
    } catch (error) {
      this.commonService.handleDBErrors(error);
    }
  }
}
