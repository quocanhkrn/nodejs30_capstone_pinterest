import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
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
import {
  ApiHeader,
  ApiQuery,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import * as path from 'path';

@ApiTags('Users')
@ApiHeader({
  name: 'token',
  description: 'Authorized token',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiQuery({
    name: 'id',
    description: 'Leave it blank if you want to get all the data',
    required: false,
  })
  @Get('get')
  async findAll(@Query('id') id: string) {
    try {
      const data: User[] = await this.usersService.find(+id);
      return { message: 'Succesfully!', data };
    } catch (err) {
      handleErr(err);
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: { type: 'string' },
        age: { type: 'integer' },
        email: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
          description: `Change the user's avatar here`,
        },
      },
    },
  })
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUser: UpdateUserDto,
    @Param('id') id: number,
  ) {
    try {
      const data: User = await this.usersService.update(+id, {
        ...updateUser,
        age: +updateUser.age || undefined,
        avatar:
          image &&
          path.join(
            `${process.env.DOMAIN}:${process.env.PORT}`,
            'imgs',
            image.filename,
          ),
      });
      return { message: 'Successfully updated!', data };
    } catch (err) {
      handleErr(err);
    }
  }

  @Delete('remove-avatar/:id')
  async removeAvatar(@Param('id') id: number) {
    try {
      const data: User = await this.usersService.removeAvatar(+id);
      return { message: 'Successfully removed your avatar!', data };
    } catch (err) {
      handleErr(err);
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number) {
    try {
      const existedUser: User = await this.usersService.findOne(+id);
      if (existedUser) {
        await this.usersService.remove(+id);
        return { message: 'Successfully deleted!' };
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      handleErr(err);
    }
  }
}
