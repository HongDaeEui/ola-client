import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('toggle')
  toggle(@Body() body: { userId: string; targetType: string; targetId: string }) {
    return this.likesService.toggle(body.userId, body.targetType, body.targetId);
  }

  @Get('status')
  getStatus(
    @Query('userId') userId: string,
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: string,
  ) {
    return this.likesService.getStatus(userId, targetType, targetId);
  }
}
