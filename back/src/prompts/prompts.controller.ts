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
import * as jwt from 'jsonwebtoken';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  private readonly logger = new Logger(PromptsController.name);

  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  getPrompts(
    @Query('category') category?: string,
    @Query('userEmail') userEmail?: string,
    @Query('page') page = '1',
    @Query('limit') limit?: string,
  ) {
    const take = limit ? parseInt(limit, 10) : undefined;
    const skip = take ? (parseInt(page, 10) - 1) * take : 0;
    return this.promptsService.findAll({ category, userEmail }, skip, take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promptsService.findOne(id);
  }

  @Patch(':id/view')
  incrementViews(@Param('id') id: string) {
    return this.promptsService.incrementViews(id);
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      toolName: string;
      category: string;
      content: string;
      userName: string;
    },
    @Headers('authorization') authorization?: string,
  ) {
    const email = this.requireEmailFromAuthHeader(authorization);
    return this.promptsService.create({
      title: body.title,
      toolName: body.toolName,
      category: body.category,
      content: body.content,
      userEmail: email,
      userName: body.userName,
    });
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
