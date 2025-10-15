import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { ProfilePermissionsService } from './profile-permissions.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profilePermissionsService: ProfilePermissionsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createProfileDto: CreateProfileDto, @Request() req) {
    const userId = req.user.id;
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

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.profileService.update(+id, updateProfileDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user-profile/state/:id')
  updateUserProfileState(
    @Param('id') id: string,
    @Body('state') state: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.profileService.updateUserProfileState(+id, state, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('state/:id')
  setState(
    @Param('id') id: string,
    @Body('state') state: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.profileService.setState(+id, state, userId);
  }

  // Endpoints tabla intermedia profile-permissions
  @UseGuards(AuthGuard('jwt'))
  @Patch('profile-permission/:id')
  assignPermissionsToProfile(
    @Param('id') profileId: number,
    @Body() dto: AssignPermissionDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.profilePermissionsService.managePermissionsToProfile(
      dto,
      profileId,
      userId,
    );
  }
}
