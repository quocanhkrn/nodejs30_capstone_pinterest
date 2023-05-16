import { Injectable } from '@nestjs/common';
import { CreateSavedImageDto } from './dto/create-saved_image.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SavedImagesService {
  private readonly prisma = new PrismaClient();

  async create(saveRequest: CreateSavedImageDto) {
    let data = this.prisma.saved_images.create({ data: saveRequest });
    return data;
  }

  async findAll() {
    let data = await this.prisma.saved_images.findMany();
    return data;
  }

  async findOne(saveRequest: CreateSavedImageDto) {
    const { image_id, saved_by_id } = saveRequest;
    let data = await this.prisma.saved_images.findFirst({
      where: { image_id, saved_by_id },
    });
    return data;
  }

  async remove(id: number) {
    let data = await this.prisma.saved_images.delete({ where: { id } });
    return data;
  }
}
