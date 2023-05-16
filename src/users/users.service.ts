import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();

  async create(newUser: CreateUserDto) {
    let { full_name, age, email, password, avatar } = newUser;
    let user = await this.prisma.users.create({
      data: { full_name, age, email, password },
    });
    return user;
  }

  async uploadAvatar(userID: number, avatarFileName: string) {
    let user = await this.findOne(userID);
    user.avatar = avatarFileName;
    let data = await this.update(userID, user);
    return data;
  }

  async findAll() {
    let data = await this.prisma.users.findMany({
      where: { is_remove: 'false' },
    });
    return data;
  }

  async findOne(id: number) {
    let user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async findOneByEmail(email: string) {
    let user = await this.prisma.users.findFirst({ where: { email } });
    return user;
  }

  async update(id: number, updateUser: UpdateUserDto) {
    let user = this.prisma.users.update({
      where: { id },
      data: updateUser,
    });
    return user;
  }

  async remove(id: number) {
    let user = await this.prisma.users.update({
      where: { id },
      data: { is_remove: 'true' },
    });
    return user;
  }
}
