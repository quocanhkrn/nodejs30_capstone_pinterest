import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/constants';
import { JwtAuthGuard } from 'src/auth/strategies/guards/jwt-auth.guard';
import { handleErr } from '../constants';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-user')
  async findAll(@Query('id') id: string) {
    try {
      const data: User[] = await this.usersService.find(+id);
      return { message: 'Succesfully!', data };
    } catch (err) {
      handleErr(err);
    }
  }

  @Put('update-user')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async update(
    @Request() req,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUser: UpdateUserDto,
  ) {
    const user = req.user.data;
    try {
      const data: User = await this.usersService.update(user.id, {
        ...updateUser,
        age: +updateUser.age || undefined,
        avatar: image?.filename,
      });
      return { message: 'Successfully updated!', data };
    } catch (err) {
      handleErr(err);
    }
  }

  @Delete('remove-avatar')
  async removeAvatar(@Request() req) {
    const user = req.user.data;
    try {
      const data: User = await this.usersService.removeAvatar(+user.id);
      return { message: 'Successfully removed your avatar!', data };
    } catch (err) {
      handleErr(err);
    }
  }

  @Delete('delete-user')
  async remove(@Request() req) {
    const user = req.user.data;
    try {
      const existedUser: User = await this.usersService.findOne(+user.id);
      if (existedUser) {
        await this.usersService.remove(+user.id);
        return { message: 'Successfully deleted!' };
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      handleErr(err);
    }
  }
}
