import {
  Controller,
  Get,
  Patch,
  Param,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { verifySupabaseJwt } from '../common/supabase-auth.util';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getByUserEmail(@Headers('authorization') authorization?: string) {
    const { email } = await this.extractUser(authorization);
    return this.notificationsService.getByUserEmail(email);
  }

  @Get('unread-count')
  async getUnreadCount(@Headers('authorization') authorization?: string) {
    const { email } = await this.extractUser(authorization);
    return this.notificationsService.getUnreadCount(email);
  }

  @Patch('read-all')
  async markAllRead(@Headers('authorization') authorization?: string) {
    const { email } = await this.extractUser(authorization);
    return this.notificationsService.markAllRead(email);
  }

  @Patch(':id/read')
  async markRead(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    await this.extractUser(authorization);
    return this.notificationsService.markRead(id);
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
