import { Controller, Get } from '@nestjs/common';
import { MeetupsService } from './meetups.service';

@Controller('meetups')
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {}

  @Get()
  findAll() {
    return this.meetupsService.findAll();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.meetupsService.findUpcoming();
  }
}
