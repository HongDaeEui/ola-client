import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import * as jwt from 'jsonwebtoken';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('userEmail') userEmail?: string,
    @Query('page') page = '1',
    @Query('limit') limit?: string,
  ) {
    if (userEmail) return this.postsService.findByUserEmail(userEmail);
    const take = limit ? parseInt(limit, 10) : undefined;
    const skip = take ? (parseInt(page, 10) - 1) * take : 0;
    return this.postsService.findAll(category, skip, take);
  }

  @Get('ranking')
  findTopByViews() {
    return this.postsService.findTopByViews();
  }

  @Get('tag-stats')
  getTagStats() {
    return this.postsService.getTagStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  create(
    @Body()
    body: {
      title: string;
      content: string;
      category: string;
      imageUrl?: string;
      userName: string;
    },
    @Headers('authorization') authorization?: string,
  ) {
    const email = this.requireEmailFromAuthHeader(authorization);
    return this.postsService.create({
      title: body.title,
      content: body.content,
      category: body.category,
      imageUrl: body.imageUrl,
      userEmail: email,
      userName: body.userName,
    });
  }

  @Patch(':id/view')
  incrementViews(@Param('id') id: string) {
    return this.postsService.incrementViews(id);
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
