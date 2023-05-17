import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { ResponseTemplate } from 'src/response.typeface';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly prisma = new PrismaClient();
  private readonly responseTemplate = new ResponseTemplate();

  async removeAvatar(userID: number): Promise<User> {
    let user: User = await this.findOne(userID);
    user.avatar = null;
    const data: User = await this.update(userID, user);
    return data;
  }

  async find(id: number): Promise<User[]> {
    const data: User[] = await this.prisma.users.findMany({
      where: { id: id || undefined, is_remove: 'false' },
      select: this.responseTemplate.user(['password']),
    });
    return data;
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.prisma.users.findUnique({
      where: { id },
      select: this.responseTemplate.user(['password']),
    });

    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    const user: User = await this.prisma.users.findFirst({
      where: { email },
      select: this.responseTemplate.user(['password']),
    });
    return user;
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<User> {
    const user: User = await this.prisma.users.update({
      where: { id },
      data: updateUser,
      select: this.responseTemplate.user(['password']),
    });
    return user;
  }

  async remove(id: number): Promise<User> {
    const user: User = await this.prisma.users.update({
      where: { id },
      data: { is_remove: 'true' },
      select: this.responseTemplate.user(['password']),
    });
    return user;
  }
}
