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
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import * as jwt from 'jsonwebtoken';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findByPost(@Query('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  create(
    @Body()
    body: {
      content: string;
      postId: string;
      userEmail: string;
      userName: string;
    },
  ) {
    return this.commentsService.create(body);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing Bearer token.');
    }

    const token = authorization.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException('Empty Bearer token.');
    }

    const email = this.extractEmailFromToken(token);
    if (!email) {
      throw new UnauthorizedException('Token does not contain an email claim.');
    }

    const result = await this.commentsService.remove(id, email);
    if (!result) {
      // Either comment does not exist or the requester is not the author
      throw new ForbiddenException(
        'You are not allowed to delete this comment.',
      );
    }
    return result;
  }

  /**
   * Supabase JWT 에서 email 클레임을 추출한다.
   * - SUPABASE_JWT_SECRET 이 있으면 verify (서명 검증)
   * - 없으면 decode 만 수행 (개발 환경 대비)
   */
  private extractEmailFromToken(token: string): string | null {
    const secret = process.env.SUPABASE_JWT_SECRET;
    try {
      let payload: jwt.JwtPayload | string | null = null;
      if (secret && secret.trim().length > 0) {
        payload = jwt.verify(token, secret) as jwt.JwtPayload;
      } else {
        this.logger.warn(
          'SUPABASE_JWT_SECRET is not configured. Falling back to unsafe decode().',
        );
        payload = jwt.decode(token);
      }

      if (!payload || typeof payload === 'string') return null;

      const candidate =
        (payload as jwt.JwtPayload & { email?: string }).email ??
        // Supabase 는 email 외에 user_metadata.email 에도 보관할 수 있음
        (payload as jwt.JwtPayload & { user_metadata?: { email?: string } })
          .user_metadata?.email ??
        null;

      return typeof candidate === 'string' ? candidate : null;
    } catch (err) {
      this.logger.warn(
        `JWT verification failed: ${(err as Error).message ?? 'unknown error'}`,
      );
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
