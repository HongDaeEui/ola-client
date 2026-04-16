import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

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
