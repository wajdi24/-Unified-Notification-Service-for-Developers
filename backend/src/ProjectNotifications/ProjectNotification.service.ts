import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './create-ProjectNotifications.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  async findAllByProject(projectId: string) {
    return this.prisma.notification.findMany({ where: { projectId } });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async update(id: string, dto: CreateNotificationDto) {
    return this.prisma.notification.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
