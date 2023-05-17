import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { SavedImagesService } from './saved_images.service';
import { JwtAuthGuard } from 'src/auth/strategies/guards/jwt-auth.guard';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Images')
@ApiHeader({
  name: 'token',
  description: 'Authorized token',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('images')
export class SavedImagesController {
  constructor(private readonly savedImagesService: SavedImagesService) {}

  @Get('get-saved-images')
  async findAll() {
    try {
      let data = await this.savedImagesService.findAll();
      return { message: 'Successfully!', data };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Post('save')
  async create(
    @Query('savedBy') savedBy: number,
    @Query('imageID') imageID: number,
  ) {
    try {
      const data = await this.savedImagesService.findOne({
        image_id: +imageID,
        saved_by_id: +savedBy,
      });
      if (data) {
        await this.savedImagesService.remove(data.id);
        return { message: 'Successfully unsaved!' };
      } else {
        let data = await this.savedImagesService.create({
          image_id: +imageID,
          saved_by_id: +savedBy,
        });
        return { message: 'Successfully saved!', data };
      }
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
