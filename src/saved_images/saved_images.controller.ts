import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { SavedImagesService } from './saved_images.service';
import { JwtAuthGuard } from 'src/auth/strategies/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('images')
export class SavedImagesController {
  constructor(private readonly savedImagesService: SavedImagesService) {}

  @Post('save/:imageID')
  async create(@Request() req, @Param('imageID') imageID: number) {
    const user = req.user.data;
    try {
      const data = await this.savedImagesService.findOne({
        image_id: +imageID,
        saved_by_id: user.id,
      });
      if (data) {
        await this.savedImagesService.remove(data.id);
        return { message: 'Successfully unsaved!' };
      } else {
        let data = await this.savedImagesService.create({
          image_id: +imageID,
          saved_by_id: user.id,
        });
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
