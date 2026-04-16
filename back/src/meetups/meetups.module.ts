import { Module } from '@nestjs/common';
import { MeetupsService } from './meetups.service';
import { MeetupsController } from './meetups.controller';

@Module({
  providers: [MeetupsService],
  controllers: [MeetupsController],
})
export class MeetupsModule {}
