import { Controller, Get, Param } from '@nestjs/common';
import { LabsService } from './labs.service';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Get()
  async getExperiments() {
    return this.labsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labsService.findOne(id);
  }
}
