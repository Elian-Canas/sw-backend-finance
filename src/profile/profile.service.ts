import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, ProfileState } from './entities/profile.entity';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
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

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
