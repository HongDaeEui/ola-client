import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { MeetupsService } from './meetups.service';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { verifySupabaseJwt } from '../common/supabase-auth.util';

@Controller('meetups')
export class MeetupsController {
  constructor(private readonly meetupsService: MeetupsService) {}

  @Post()
  async create(
    @Body() dto: CreateMeetupDto,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.meetupsService.createMeetup(dto, email);
  }

  @Get()
  findAll() {
    return this.meetupsService.findAll();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.meetupsService.findUpcoming();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetupsService.findById(id);
  }

  @Post(':id/rsvp')
  async rsvp(
    @Param('id') id: string,
    @Body() body: { userName: string },
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.meetupsService.rsvpToggle(id, email, body.userName);
  }

  @Get(':id/status')
  async getStatus(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.meetupsService.getStatus(id, email);
  }

  private async extractUser(authorization?: string) {
    if (!authorization?.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing Bearer token.');
    }
    const token = authorization.slice(7).trim();
    if (!token) throw new UnauthorizedException('Empty Bearer token.');
    return verifySupabaseJwt(token);
  }
}
