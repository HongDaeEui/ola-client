import {
  Controller,
  Get,
  Patch,
  Param,
  Headers,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getByUserEmail(@Headers('authorization') authorization?: string) {
    const email = this.requireEmailFromAuthHeader(authorization);
    return this.notificationsService.getByUserEmail(email);
  }

  @Get('unread-count')
  getUnreadCount(@Headers('authorization') authorization?: string) {
    const email = this.requireEmailFromAuthHeader(authorization);
    return this.notificationsService.getUnreadCount(email);
  }

  @Patch('read-all')
  markAllRead(@Headers('authorization') authorization?: string) {
    const email = this.requireEmailFromAuthHeader(authorization);
    return this.notificationsService.markAllRead(email);
  }

  @Patch(':id/read')
  markRead(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    // 인증만 요구 (권한 체크는 서비스 레이어로 확장 가능)
    this.requireEmailFromAuthHeader(authorization);
    return this.notificationsService.markRead(id);
  }

  /**
   * Authorization 헤더에서 Bearer 토큰을 추출하고 email 클레임을 반환한다.
   * 실패 시 401 UnauthorizedException 을 throw 한다.
   */
  private requireEmailFromAuthHeader(authorization?: string): string {
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

      const candidate =
        (payload as jwt.JwtPayload & { email?: string }).email ??
        (payload as jwt.JwtPayload & { user_metadata?: { email?: string } })
          .user_metadata?.email ??
        null;

      if (typeof candidate !== 'string' || candidate.length === 0) {
        throw new UnauthorizedException(
          'Token does not contain an email claim.',
        );
      }
      return candidate;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.warn(
        `JWT verification failed: ${(err as Error).message ?? 'unknown error'}`,
      );
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
