import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  async validateUser({ email, password }): Promise<User> {
    const existedUser: User = await this.prisma.users.findFirst({
      where: { email },
    });

    if (existedUser) {
      const hash: string = existedUser.password;
      const isPasswordMatched: boolean = await bcrypt.compare(password, hash);
      if (isPasswordMatched) {
        return existedUser;
      } else {
        throw new HttpException('Incorrect password!', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new UnauthorizedException('This email is not existed!');
    }
  }

  async signUp(user: CreateUserDto): Promise<User> {
    const hash: string = await bcrypt.hash(user.password, 10);
    const createdUser: User = await this.prisma.users.create({
      data: { ...user, password: hash },
    });
    return createdUser;
  }
}
