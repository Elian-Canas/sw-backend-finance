import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CommonService {
  handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    if (error instanceof HttpException) {
      throw error;
    }

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
