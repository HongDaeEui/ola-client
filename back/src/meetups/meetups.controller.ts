import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Post(':id/rsvp')
  rsvp(
    @Param('id') id: string,
    @Body() body: { userEmail: string; userName: string },
  ) {
    return this.meetupsService.rsvpToggle(id, body.userEmail, body.userName);
  }

  @Get(':id/status')
  getStatus(
    @Param('id') id: string,
    @Query('userEmail') userEmail: string,
  ) {
    return this.meetupsService.getStatus(id, userEmail);
  }
}
