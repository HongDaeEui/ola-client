import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaModule } from '../prisma/prisma.module';

// Vercel 서버리스 환경에서는 WebSocket Gateway 사용 시 FUNCTION_INVOCATION_FAILED 가
// 발생하므로, VERCEL 환경변수가 설정된 경우 Gateway 를 등록하지 않는다.
const gatewayProviders = process.env.VERCEL ? [] : [NotificationsGateway];

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, ...gatewayProviders],
  exports: [NotificationsService],
})
export class NotificationsModule {}
