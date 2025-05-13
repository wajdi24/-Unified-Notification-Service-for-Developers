import { Module } from '@nestjs/common';
import { NotificationService } from './ProjectNotification.service';
import { NotificationController } from './ProjectNotification.controller';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
