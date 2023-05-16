import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  async validateUser({ email, password }) {
    let existedUser = await this.prisma.users.findFirst({
      where: { email },
    });

    if (existedUser) {
      const hash = existedUser.password;
      const isPasswordMatched = await bcrypt.compare(password, hash);
      if (isPasswordMatched) {
        return existedUser;
      } else {
        throw new HttpException('Incorrect password!', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new UnauthorizedException('This email is not existed!');
    }
  }

  async signUp(user: CreateUserDto) {
    const hash = await bcrypt.hash(user.password, 10);
    let createdUser = this.prisma.users.create({
      data: { ...user, password: hash },
    });
    return createdUser;
  }
}
