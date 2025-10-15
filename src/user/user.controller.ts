import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    const userId = req.user.id;
    return this.userService.create(createUserDto, userId);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.userService.update(+id, updateUserDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('state/:id')
  setState(
    @Param('id') id: string,
    @Body('state') state: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.userService.setState(+id, state, userId);
  }
}
