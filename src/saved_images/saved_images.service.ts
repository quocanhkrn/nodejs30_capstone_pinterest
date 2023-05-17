import { Injectable } from '@nestjs/common';
import { CreateSavedImageDto } from './dto/create-saved_image.dto';
import { PrismaClient } from '@prisma/client';
import { ResponseTemplate } from 'src/response.typeface';
import { SavedImage } from './entities/saved_image.entity';

@Injectable()
export class SavedImagesService {
  private readonly prisma = new PrismaClient();
  private readonly responseTemplate = new ResponseTemplate();

  async create(saveRequest: CreateSavedImageDto): Promise<SavedImage> {
    const data: SavedImage = await this.prisma.saved_images.create({
      data: saveRequest,
      select: this.responseTemplate.savedImage(),
    });
    return data;
  }

  async findAll(): Promise<SavedImage[]> {
    const data: SavedImage[] = await this.prisma.saved_images.findMany({
      select: this.responseTemplate.savedImage(),
    });
    return data;
  }

  async findOne(saveRequest: CreateSavedImageDto): Promise<SavedImage> {
    const { image_id, saved_by_id } = saveRequest;
    const data: SavedImage = await this.prisma.saved_images.findFirst({
      where: { image_id, saved_by_id },
      select: this.responseTemplate.savedImage(),
    });
    return data;
  }

  async remove(id: number): Promise<SavedImage> {
    const data: SavedImage = await this.prisma.saved_images.delete({
      where: { id },
      select: this.responseTemplate.savedImage(),
    });
    return data;
  }
}
