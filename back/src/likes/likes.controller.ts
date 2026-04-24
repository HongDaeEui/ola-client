import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import * as jwt from 'jsonwebtoken';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  private readonly logger = new Logger(LikesController.name);

  constructor(private readonly likesService: LikesService) {}

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('toggle')
  toggle(
    @Body() body: { targetType: string; targetId: string },
    @Headers('authorization') authorization?: string,
  ) {
    const userId = this.requireUserIdFromAuthHeader(authorization);
    return this.likesService.toggle(userId, body.targetType, body.targetId);
  }

  @Get('status')
  getStatus(
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: string,
    @Headers('authorization') authorization?: string,
  ) {
    const userId = this.requireUserIdFromAuthHeader(authorization);
    return this.likesService.getStatus(userId, targetType, targetId);
  }

  /**
   * Authorization 헤더에서 Bearer 토큰을 추출하고 Supabase `sub` 클레임(userId)을 반환한다.
   * 실패 시 401 UnauthorizedException 을 throw 한다.
   */
  private requireUserIdFromAuthHeader(authorization?: string): string {
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing Bearer token.');
    }

    const token = authorization.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException('Empty Bearer token.');
    }

    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret || secret.trim().length === 0) {
      this.logger.error(
        'SUPABASE_JWT_SECRET is not configured. Refusing to accept JWT without signature verification.',
      );
      throw new UnauthorizedException(
        'Server authentication is not configured.',
      );
    }

    try {
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;
      if (!payload || typeof payload === 'string') {
        throw new UnauthorizedException('Invalid token payload.');
      }
      const sub = (payload as jwt.JwtPayload & { sub?: string }).sub;
      if (typeof sub !== 'string' || sub.length === 0) {
        throw new UnauthorizedException(
          'Token does not contain a sub claim.',
        );
      }
      return sub;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.warn(
        `JWT verification failed: ${(err as Error).message ?? 'unknown error'}`,
      );
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
