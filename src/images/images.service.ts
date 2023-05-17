import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaClient } from '@prisma/client';
import { ResponseTemplate } from 'src/response.typeface';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService {
  private readonly prisma = new PrismaClient();
  private readonly responseTemplate = new ResponseTemplate();

  async create(createImage: CreateImageDto): Promise<Image> {
    const { is_remove, ...image }: Image = await this.prisma.images.create({
      data: createImage,
    });
    return image;
  }

  async findAll(
    userID: number,
    searchKeyword: string = undefined,
  ): Promise<Image[]> {
    const data: Image[] = await this.prisma.images.findMany({
      where: {
        name: { contains: searchKeyword },
        created_by_id: userID || undefined,
        is_remove: 'false',
      },
      select: {
        ...this.responseTemplate.image(['created_by_id']),
        created_by: {
          select: this.responseTemplate.user(['password']),
        },
      },
    });
    return { ...data };
  }

  async findOne(id: number): Promise<Image> {
    const image: Image = await this.prisma.images.findUnique({
      where: { id },
      select: {
        ...this.responseTemplate.image(['created_by_id']),
        created_by: { select: this.responseTemplate.user(['password']) },
      },
    });

    if (image) {
      return image;
    } else {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateImage: UpdateImageDto): Promise<Image> {
    await this.findOne(id);

    const updatedImage: Image = await this.prisma.images.update({
      where: { id },
      data: { ...updateImage },
      select: {
        ...this.responseTemplate.image(['created_by_id']),
        created_by: { select: this.responseTemplate.user(['password']) },
      },
    });

    return updatedImage;
  }

  async remove(id: number): Promise<Image> {
    const image: Image = await this.prisma.images.update({
      where: { id },
      data: { is_remove: 'true' },
    });
    return image;
  }
}
