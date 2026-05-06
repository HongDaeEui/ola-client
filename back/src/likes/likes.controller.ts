import { Controller, Post, Get, Body, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LikesService } from './likes.service';
import { verifySupabaseJwt } from '../common/supabase-auth.util';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('toggle')
  async toggle(
    @Body() body: { targetType: string; targetId: string },
    @Headers('authorization') authorization?: string,
  ) {
    const { sub } = await this.extractUser(authorization);
    return this.likesService.toggle(sub, body.targetType, body.targetId);
  }

  @Get('status')
  async getStatus(
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { sub } = await this.extractUser(authorization);
    return this.likesService.getStatus(sub, targetType, targetId);
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
