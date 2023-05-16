import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ImagesService {
  prisma = new PrismaClient();

  async create(createImage: CreateImageDto) {
    let image = await this.prisma.images.create({ data: createImage });
    return image;
  }

  async findAll(searchKeyword: string = undefined) {
    let data = await this.prisma.images.findMany({
      where: { name: { contains: searchKeyword }, is_remove: 'false' },
    });
    return data;
  }

  async findAllByUserID(userID: number, searchKeyword: string = undefined) {
    let data = await this.prisma.images.findMany({
      where: {
        name: { contains: searchKeyword },
        created_by_id: userID,
        is_remove: 'false',
      },
    });
    return data;
  }

  async findOne(id: number) {
    let image = await this.prisma.images.findUnique({
      where: { id },
    });

    if (image) {
      return image;
    } else {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateImage: UpdateImageDto) {
    let updatedImage = await this.prisma.images.update({
      where: { id },
      data: updateImage,
    });

    return updatedImage;
  }

  async remove(id: number) {
    let image = await this.prisma.images.update({
      where: { id },
      data: { is_remove: 'true' },
    });
    console.log(image);
    return image;
  }
}
