import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CommentsService } from './comments.service';
import { verifySupabaseJwt } from '../common/supabase-auth.util';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findByPost(@Query('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  async create(
    @Body()
    body: {
      content: string;
      postId: string;
      userName: string;
    },
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    return this.commentsService.create({
      content: body.content,
      postId: body.postId,
      userEmail: email,
      userName: body.userName,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const { email } = await this.extractUser(authorization);
    const result = await this.commentsService.remove(id, email);
    if (!result) {
      throw new ForbiddenException('You are not allowed to delete this comment.');
    }
    return result;
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
