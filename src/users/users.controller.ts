import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

const fileUploadOptions = {
  storage: diskStorage({
    destination: './public/imgs',
    filename: (req, file, callback) => {
      callback(null, Date.now() + '_' + file.originalname);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new BadRequestException('Not supported filetype!');
      return callback(error, false);
    }
    callback(null, true);
  },
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('new-user')
  async create(@Body() newUser: CreateUserDto) {
    try {
      let existedUser = await this.usersService.findOneByEmail(newUser.email);
      if (existedUser) {
        throw new HttpException(
          'This email is existed!',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        let data = await this.usersService.create(newUser);
        return { message: 'Successfully created!', data };
      }
    } catch (err) {
      if (err) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('image', fileUploadOptions))
  async uploadAvatar(
    @Body('userID') userID: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      let data = await this.usersService.uploadAvatar(userID, image.filename);
      return { message: 'Successfully updated your avatar!', data };
    } catch (err) {}
  }

  @Get('get-users')
  async findAll() {
    try {
      let data = await this.usersService.findAll();
      return { message: 'Succesfully!', data };
    } catch (err) {
      if (err) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Get('get-user/:id')
  async findOne(@Param('id') id: string) {
    try {
      let user = await this.usersService.findOne(+id);
      return { message: 'Succesfully!', data: user };
    } catch (err) {
      if (err) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Patch('update-user/:id')
  async update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    try {
      await this.usersService.update(+id, updateUser);
      return { message: 'Successfully updated!' };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Delete('delete-user/:id')
  async remove(@Param('id') id: string) {
    try {
      let existedUser = await this.usersService.findOne(+id);
      if (existedUser) {
        await this.usersService.remove(+id);
        return { message: 'Successfully deleted!' };
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      if (err) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
