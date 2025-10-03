import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  create(
    @Body() createProfileDto: CreateProfileDto,
    @Headers('user_id') userId: number,
  ) {
    return this.profileService.create(createProfileDto, userId);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Headers('user_id') userId: number,
  ) {
    return this.profileService.update(+id, updateProfileDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @Post('user-profile/state/:id')
  updateUserProfileState(
    @Param('id') id: string,
    @Body('state') state: number,
    @Headers('user_id') userId: number,
  ) {
    return this.profileService.updateUserProfileState(+id, state, userId);
  }
}
