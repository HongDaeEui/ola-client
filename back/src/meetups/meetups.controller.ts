import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { MeetupsService } from './meetups.service';

@Controller('meetups')
export class MeetupsController {
  private readonly logger = new Logger(MeetupsController.name);

  constructor(private readonly meetupsService: MeetupsService) {}

  @Get()
  findAll() {
    return this.meetupsService.findAll();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.meetupsService.findUpcoming();
  }

  @Post(':id/rsvp')
  rsvp(
    @Param('id') id: string,
    @Body() body: { userName: string },
    @Headers('authorization') authorization?: string,
  ) {
    const email = this.requireEmailFromAuthHeader(authorization);
    return this.meetupsService.rsvpToggle(id, email, body.userName);
  }

  @Get(':id/status')
  getStatus(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    const email = this.requireEmailFromAuthHeader(authorization);
    return this.meetupsService.getStatus(id, email);
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
      const email =
        (payload as jwt.JwtPayload & { email?: string }).email ??
        (payload as jwt.JwtPayload & { user_metadata?: { email?: string } })
          .user_metadata?.email ??
        null;
      if (typeof email !== 'string' || email.length === 0) {
        throw new UnauthorizedException(
          'Token does not contain an email claim.',
        );
      }
      return email;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.warn(
        `JWT verification failed: ${(err as Error).message ?? 'unknown error'}`,
      );
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
