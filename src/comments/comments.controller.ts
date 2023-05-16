import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('post-comment')
  async create(@Body() comment: CreateCommentDto) {
    try {
      let postedComment = await this.commentsService.create({
        ...comment,
        date: new Date(),
      });
      return { message: 'Successfully posted!', data: postedComment };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Get('get-comments')
  async findAll(@Query('imageID') imageID: string) {
    try {
      let data = await this.commentsService.findAll(+imageID);
      return { message: 'Successfully!', data };
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
