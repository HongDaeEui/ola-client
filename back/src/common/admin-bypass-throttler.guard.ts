import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class AdminBypassThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = (request.headers['x-admin-secret'] as string | undefined) ?? '';
    const expected = process.env.ADMIN_SECRET ?? '';
    if (expected.length > 0 && provided === expected) return true;
    return super.shouldSkip(context);
  }
}
