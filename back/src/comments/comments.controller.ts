import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findByPost(@Query('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Post()
  create(
    @Body()
    body: {
      content: string;
      postId: string;
      userEmail: string;
      userName: string;
    },
  ) {
    return this.commentsService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userEmail') userEmail: string) {
    return this.commentsService.remove(id, userEmail);
  }
}
