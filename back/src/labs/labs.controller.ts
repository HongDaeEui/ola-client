import { Controller, Get, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { LabsService } from './labs.service';
import { AdminGuard } from '../common/admin.guard';

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

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labsService.remove(id);
  }
}
