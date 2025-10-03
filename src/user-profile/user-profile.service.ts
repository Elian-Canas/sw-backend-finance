import { Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserProfileDto: CreateUserProfileDto) {
    return 'This action adds a new userProfile';
  }

  findAll() {
    return `This action returns all userProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userProfile`;
  }

  update(id: number, updateUserProfileDto: UpdateUserProfileDto) {
    return `This action updates a #${id} userProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} userProfile`;
  }

  async setState(id: number, state: number, userId: number) {
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
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
