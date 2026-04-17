import { Controller, Get, Patch, Query, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getByUserEmail(@Query('userEmail') userEmail: string) {
    return this.notificationsService.getByUserEmail(userEmail);
  }

  @Get('unread-count')
  getUnreadCount(@Query('userEmail') userEmail: string) {
    return this.notificationsService.getUnreadCount(userEmail);
  }

  @Patch('read-all')
  markAllRead(@Query('userEmail') userEmail: string) {
    return this.notificationsService.markAllRead(userEmail);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }
}
