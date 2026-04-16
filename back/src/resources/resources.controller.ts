import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.resourcesService.findAll(type, difficulty);
  }

  @Get('featured')
  findFeatured() {
    return this.resourcesService.findFeatured();
  }

  @Get('type-counts')
  getTypeCounts() {
    return this.resourcesService.getTypeCounts();
  }

  @Patch(':id/read')
  incrementReads(@Param('id') id: string) {
    return this.resourcesService.incrementReads(id);
  }
}
