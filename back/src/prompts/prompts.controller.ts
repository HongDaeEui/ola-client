import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  getPrompts(@Query('category') category?: string) {
    return this.promptsService.findAll({ category });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promptsService.findOne(id);
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
