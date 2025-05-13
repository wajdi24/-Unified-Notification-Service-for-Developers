import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body
} from '@nestjs/common';
import { NotificationService } from './ProjectNotification.service';
import { CreateNotificationDto } from './create-ProjectNotifications.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private service: NotificationService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Get('project/:projectId')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.service.findAllByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateNotificationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
