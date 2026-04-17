import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('userEmail') userEmail?: string,
    @Query('page') page = '1',
    @Query('limit') limit?: string,
  ) {
    if (userEmail) return this.postsService.findByUserEmail(userEmail);
    const take = limit ? parseInt(limit, 10) : undefined;
    const skip = take ? (parseInt(page, 10) - 1) * take : 0;
    return this.postsService.findAll(category, skip, take);
  }

  @Get('ranking')
  findTopByViews() {
    return this.postsService.findTopByViews();
  }

  @Get('tag-stats')
  getTagStats() {
    return this.postsService.getTagStats();
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
      imageUrl?: string;
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
