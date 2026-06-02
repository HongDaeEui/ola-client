import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { verifySupabaseJwt } from './supabase-auth.util';

const ADMIN_EMAIL = 'admin@olalab.kr';

/**
 * AdminGuard
 *
 * 다음 두 가지 방식 중 하나로 관리자 인증을 허용한다:
 * 1. X-Admin-Secret 헤더 값이 process.env.ADMIN_SECRET 과 일치
 * 2. Authorization: Bearer {token} 에서 Supabase JWT 검증 후 email === ADMIN_EMAIL
 *
 * - 두 방식 모두 실패 시 403 ForbiddenException
 * - ADMIN_SECRET 환경변수 미설정 시 Bearer 토큰 방식만 사용
 */
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 1) X-Admin-Secret 헤더 방식
    const provided =
      (request.headers['x-admin-secret'] as string | undefined) ??
      (request.headers['X-Admin-Secret'] as unknown as string | undefined);
    const expected = process.env.ADMIN_SECRET;

    if (expected && expected.trim().length > 0 && provided === expected) {
      return true;
    }

    // 2) Bearer 토큰 방식 — ADMIN_SECRET 직접 비교 또는 Supabase JWT 검증
    const authorization = request.headers['authorization'] as string | undefined;
    if (authorization?.toLowerCase().startsWith('bearer ')) {
      const token = authorization.slice(7).trim();

      // 2-1) Bearer token === ADMIN_SECRET
      if (expected && token === expected) {
        return true;
      }
      try {
        const { email } = await verifySupabaseJwt(token);
        if (email === ADMIN_EMAIL) {
          return true;
        }
        throw new ForbiddenException('Not an admin account.');
      } catch (err) {
        if (err instanceof ForbiddenException) throw err;
        // JWT 검증 실패 — 아래에서 최종 거부
      }
    }

    throw new ForbiddenException('Invalid or missing admin credentials.');
  }
}
