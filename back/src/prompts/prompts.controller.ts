import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  getPrompts(
    @Query('category') category?: string,
    @Query('userEmail') userEmail?: string,
  ) {
    return this.promptsService.findAll({ category, userEmail });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promptsService.findOne(id);
  }

  @Patch(':id/view')
  incrementViews(@Param('id') id: string) {
    return this.promptsService.incrementViews(id);
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      toolName: string;
      category: string;
      content: string;
      userEmail: string;
      userName: string;
    },
  ) {
    return this.promptsService.create(body);
  }
}
