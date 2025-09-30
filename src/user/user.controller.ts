import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  createUser(
    @Body() createUserDto: CreateUserDto,
    @Headers("user_id") userId: number
  ) {
    return this.userService.create(createUserDto, userId);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch("state/:id")
  setState(@Param("id") id: string,
    @Body('state') state: number,
    @Headers("user_id") userId: number
) {
    return this.userService.setState(+id, state, userId);
  }
}
