import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentsService {
  private readonly prisma = new PrismaClient();

  async create(comment: CreateCommentDto) {
    let postedComment = await this.prisma.comments.create({ data: comment });
    return postedComment;
  }

  async findAll(imageID: number = undefined) {
    let data = await this.prisma.comments.findMany({
      where: imageID ? { image_id: imageID } : undefined,
      include: { created_by: true },
    });
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
