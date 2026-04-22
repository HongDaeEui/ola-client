import { Controller, Get, Param, Query } from '@nestjs/common';
import { LabsService } from './labs.service';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Get()
  async getExperiments(@Query('category') category?: string) {
    return this.labsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labsService.findOne(id);
  }
}
