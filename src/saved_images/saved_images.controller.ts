import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { SavedImagesService } from './saved_images.service';
import { CreateSavedImageDto } from './dto/create-saved_image.dto';

@Controller('images')
export class SavedImagesController {
  constructor(private readonly savedImagesService: SavedImagesService) {}

  @Post('save')
  async create(@Body() saveRequest: CreateSavedImageDto) {
    try {
      const data = await this.savedImagesService.findOne(saveRequest);
      if (data) {
        await this.savedImagesService.remove(data.id);
        return { message: 'Successfully unsaved!' };
      } else {
        let data = await this.savedImagesService.create(saveRequest);
        return { message: 'Successfully saved!', data };
      }
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Get('get-saved-images')
  async findAll() {
    try {
      let data = await this.savedImagesService.findAll();
      return { message: 'Successfully!', data };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
