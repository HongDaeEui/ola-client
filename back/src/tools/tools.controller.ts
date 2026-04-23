import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ToolsService } from './tools.service';
import { AdminGuard } from '../common/admin.guard';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('pricing') pricing?: string,
    @Query('sort') sort?: string,
  ) {
    return this.toolsService.findAll({ category, pricing, sort });
  }

  @Get('featured')
  findFeatured() {
    return this.toolsService.findFeatured();
  }

  @Get('ranking')
  findTopByRating() {
    return this.toolsService.findTopByRating();
  }

  @Get('categories')
  getCategoryCounts() {
    return this.toolsService.getCategoryCounts();
  }

  @UseGuards(AdminGuard)
  @Get('pending')
  findPending() {
    return this.toolsService.findPending();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.toolsService.approve(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.toolsService.reject(id);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  create(
    @Body()
    body: {
      name: string;
      shortDesc: string;
      description: string;
      category: string;
      launchUrl: string;
      pricingModel?: string;
      tags?: string[];
    },
  ) {
    return this.toolsService.create(body);
  }
}
