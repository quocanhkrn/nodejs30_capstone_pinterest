import { Express } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
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
import {
  ApiTags,
  ApiHeader,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import * as path from 'path';

@ApiTags('Images')
@ApiHeader({
  name: 'token',
  description: 'Authorized token',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiQuery({ name: 'byUser', required: false })
  @ApiQuery({ name: 'search', required: false })
  @Get('get')
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

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    try {
      const image: Image = await this.imagesService.findOne(+id);
      return { message: 'Successfully!', data: image };
    } catch (err) {
      handleErr(err);
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string', format: 'binary' },
        created_by_id: { type: 'integer' },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async create(
    @Body() imageInfo: CreateImageDto,
    @UploadedFile() uploadedImage: Express.Multer.File,
  ) {
    try {
      const image: Image = await this.imagesService.create({
        ...imageInfo,
        created_by_id: +imageInfo.created_by_id,
        file_name: path.join(
          `${process.env.DOMAIN}:${process.env.PORT}`,
          'imgs',
          uploadedImage.filename,
        ),
      });
      return { message: 'Successfully uploaded!', data: image };
    } catch (err) {
      handleErr(err);
    }
  }

  @ApiBody({ type: CreateImageDto })
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateImage: UpdateImageDto) {
    try {
      const image: Image = await this.imagesService.update(+id, updateImage);
      return { message: 'Successfully updated!', data: image };
    } catch (err) {
      handleErr(err);
    }
  }

  @Delete('delete/:id')
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
