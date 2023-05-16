import { Express } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  InternalServerErrorException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

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

@UseGuards(AuthGuard('local'))
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', fileUploadOptions))
  async create(
    @Body() imageInfo: CreateImageDto,
    @UploadedFile() uploadedImage: Express.Multer.File,
  ) {
    try {
      let image = await this.imagesService.create({
        ...imageInfo,
        created_by_id: +imageInfo.created_by_id,
        file_name: uploadedImage.filename,
      });
      return { message: 'Successfully uploaded!', data: image };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Get('get-images')
  async findAll(
    @Query('byUser') byUser: string,
    @Query('search') searchKeyword: string,
  ) {
    try {
      let data;

      if (byUser) {
        data = await this.imagesService.findAllByUserID(+byUser, searchKeyword);
      } else {
        data = await this.imagesService.findAll(searchKeyword);
      }

      return { message: 'Successfully!', data };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Get('get-image/:id')
  async findOne(@Param('id') id: string) {
    try {
      let image = await this.imagesService.findOne(+id);
      return { message: 'Successfully!', data: image };
    } catch (err) {
      if (err) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Patch('update-image/:id')
  async update(@Param('id') id: string, @Body() updateImage: UpdateImageDto) {
    try {
      let image = await this.imagesService.update(+id, updateImage);
      return { message: 'Successfully updated!', data: image };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Delete('delete-image/:id')
  async remove(@Param('id') id: string) {
    try {
      let existedImage = await this.imagesService.findOne(+id);
      if (existedImage) {
        await this.imagesService.remove(+id);
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
