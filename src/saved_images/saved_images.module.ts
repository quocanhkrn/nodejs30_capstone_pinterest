import { Module } from '@nestjs/common';
import { SavedImagesService } from './saved_images.service';
import { SavedImagesController } from './saved_images.controller';

@Module({
  controllers: [SavedImagesController],
  providers: [SavedImagesService]
})
export class SavedImagesModule {}
