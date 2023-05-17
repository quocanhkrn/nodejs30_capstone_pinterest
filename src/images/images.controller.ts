import { Express } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Put,
  Res,
  Query,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/strategies/guards/jwt-auth.guard';
import { handleErr, imageUploadOptions } from 'src/constants';
import { Image } from './entities/image.entity';
import * as path from 'path';

@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async create(
    @Request() req,
    @Body() imageInfo: CreateImageDto,
    @UploadedFile() uploadedImage: Express.Multer.File,
  ) {
    try {
      const user = req.user.data;
      const image: Image = await this.imagesService.create({
        ...imageInfo,
        created_by_id: user.id,
        file_name: uploadedImage.filename,
      });
      return { message: 'Successfully uploaded!', data: image };
    } catch (err) {
      handleErr(err);
    }
  }

  @Get('get-images')
  async findAll(
    @Query('byUser') byUser: string,
    @Query('search') searchKeyword: string,
  ) {
    try {
      const data: Image[] = await this.imagesService.findAll(
        +byUser,
        searchKeyword,
      );
      return { message: 'Successfully!', data };
    } catch (err) {
      handleErr(err);
    }
  }

  @Get('get-image/:id')
  async findOne(@Param('id') id: string) {
    try {
      const image: Image = await this.imagesService.findOne(+id);
      return { message: 'Successfully!', data: image };
    } catch (err) {
      handleErr(err);
    }
  }

  @Get(':fileName')
  sendImage(@Param('fileName') fileName: string, @Res() res) {
    return res.sendFile(path.join(process.cwd(), 'public/imgs/' + fileName));
  }

  @Put('update-image/:id')
  async update(@Param('id') id: string, @Body() updateImage: UpdateImageDto) {
    try {
      const image: Image = await this.imagesService.update(+id, updateImage);
      return { message: 'Successfully updated!', data: image };
    } catch (err) {
      handleErr(err);
    }
  }

  @Delete('delete-image')
  async remove(@Param('id') id: string) {
    try {
      const existedImage: Image = await this.imagesService.findOne(+id);
      if (existedImage) {
        await this.imagesService.remove(+id);
        return { message: 'Successfully deleted!' };
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      handleErr(err);
    }
  }
}
