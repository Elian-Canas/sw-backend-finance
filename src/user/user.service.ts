import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User, UserState } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EncryptBcryptAdapter } from 'src/adapters/encrypt.adapter';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly encryptAdapter: EncryptBcryptAdapter,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto, userHeader: number) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: await this.encryptAdapter.encrypt(password),
        created_by: userHeader ?? null,
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: any) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email, state: 1 },
      select: { password: true, email: true, id: true },
    });

    if (!user)
      throw new UnauthorizedException("Credentials are not valid (email)");

    if (!this.encryptAdapter.compareSync(password, user.password)) {
      throw new UnauthorizedException("Credentials are not valid (password)");
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id, email: user.email }),
    };
  }

  private getJwtToken(payload: { id: number; email: string }) {
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
    return token;
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({ where: { state: 1 } });
      return users;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    try {
      await this.userRepository.update(id, {
        ...updateUserDto,
        updated_by: userId,
      });
      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async setState(id: number, state: number, userId: number) {
  try {
      await this.userRepository.update(id, { state, updated_by: userId });
      return { message: `User ${state === 1 ? "activated" : "inactivated"} successfully` };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505") throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException("Please check server logs");
  }
}
