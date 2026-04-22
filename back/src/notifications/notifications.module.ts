import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';

// Vercel serverless doesn't support WebSocket — skip gateway to prevent FUNCTION_INVOCATION_FAILED
const gatewayProviders = process.env.VERCEL ? [] : [NotificationsGateway];

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, ...gatewayProviders],
  exports: [NotificationsService],
})
export class NotificationsModule {}
