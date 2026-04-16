import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('toggle')
  toggle(@Body() body: { userId: string; targetType: string; targetId: string }) {
    return this.bookmarksService.toggle(body.userId, body.targetType, body.targetId);
  }

  @Get('status')
  getStatus(
    @Query('userId') userId: string,
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: string,
  ) {
    return this.bookmarksService.getStatus(userId, targetType, targetId);
  }

  @Get()
  getUserBookmarks(@Query('userId') userId: string) {
    return this.bookmarksService.getUserBookmarks(userId);
  }
}
