import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { verifySupabaseJwt } from '../common/supabase-auth.util';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('toggle')
  async toggle(
    @Body() body: { targetType: string; targetId: string },
    @Headers('authorization') authorization?: string,
  ) {
    const { sub: userId } = await this.extractUser(authorization);
    return this.bookmarksService.toggle(userId, body.targetType, body.targetId);
  }

  @Get('status')
  async getStatus(
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { sub: userId } = await this.extractUser(authorization);
    return this.bookmarksService.getStatus(userId, targetType, targetId);
  }

  @Get()
  async getUserBookmarks(@Headers('authorization') authorization?: string) {
    const { sub: userId } = await this.extractUser(authorization);
    return this.bookmarksService.getUserBookmarks(userId);
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
