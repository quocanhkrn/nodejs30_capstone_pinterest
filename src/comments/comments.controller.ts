import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/strategies/guards/jwt-auth.guard';
import { handleErr } from '../constants';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('post-comment')
  async create(@Body() comment: CreateCommentDto, @Request() req) {
    try {
      const user = req.user.data;
      const postedComment = await this.commentsService.create({
        ...comment,
        created_by_id: user.id,
        date: new Date(),
      });
      return { message: 'Successfully posted!', data: postedComment };
    } catch (err) {
      handleErr(err);
    }
  }

  @Get('get-comments')
  async findAll(@Query('imageID') imageID: string) {
    try {
      const data = await this.commentsService.findAll(+imageID);
      return { message: 'Successfully!', data };
    } catch (err) {
      handleErr(err);
    }
  }

  @Delete('delete/:id')
  async deleteComment(@Param('id') id: string) {
    try {
      await this.commentsService.delete(+id);
      return { message: 'Successfully deleted!' };
    } catch (err) {
      handleErr(err);
    }
  }
}
