import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('userEmail') userEmail?: string,
  ) {
    if (userEmail) return this.postsService.findByUserEmail(userEmail);
    return this.postsService.findAll(category);
  }

  @Get('ranking')
  findTopByViews() {
    return this.postsService.findTopByViews();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      content: string;
      category: string;
      userEmail: string;
      userName: string;
    },
  ) {
    return this.postsService.create(body);
  }

  @Patch(':id/view')
  incrementViews(@Param('id') id: string) {
    return this.postsService.incrementViews(id);
  }
}
