import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaClient } from '@prisma/client';
import { ResponseTemplate } from 'src/response.typeface';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  private readonly prisma = new PrismaClient();
  private readonly responseTemplate = new ResponseTemplate();

  async create(comment: CreateCommentDto): Promise<Comment> {
    const { is_remove, ...data }: Comment = await this.prisma.comments.create({
      data: comment,
    });
    return data;
  }

  async findAll(imageID: number = undefined): Promise<Comment[]> {
    const data: Comment[] = await this.prisma.comments.findMany({
      where: {
        image_id: imageID || undefined,
        is_remove: 'false',
      },
      select: {
        ...this.responseTemplate.comment(['created_by_id']),
        created_by: {
          select: { ...this.responseTemplate.user(['password']) },
        },
      },
    });
    return data;
  }

  async delete(id: number): Promise<Comment> {
    const data: Comment = await this.prisma.comments.update({
      where: { id },
      data: { is_remove: 'true' },
    });
    return data;
  }
}
