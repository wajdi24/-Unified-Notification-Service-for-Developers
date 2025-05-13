import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MailService } from '../mail/mail.service';
import { DeliveryType } from '@prisma/client';

@Injectable()
export class NotificationService {
  create(dto: CreateNotificationDto, id: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async sendNotification(userId: string, projectId: string, dto: CreateNotificationDto) {
    // Create a notification record (basic info)
    const notification = await this.prisma.notification.create({
      data: {
        title: dto.title,
        projectId: projectId,
        externalId: '', // You might want to generate this
      },
    });

    // Create a notification delivery record (actual delivery details)
    const delivery = await this.prisma.notificationDelivery.create({
      data: {
        title: dto.title,
        subject: dto.title, // or use a separate subject field if available
        body: dto.message,
        type: dto.channel,
        projectId: projectId,
        userId: userId,
      },
    });

    try {
      if (dto.channel === DeliveryType.EMAIL) {
        await this.mailService.sendEmail({
          to: dto.recipient,
          subject: dto.title,
          template: 'default',
          context: {
            title: dto.title,
            message: dto.message,
          },
        });

        // You might want to update some status here if needed
        // Note: There's no status field in your current schema
      }

      return { message: 'Notification sent successfully.' };
    } catch (error) {
      // Handle error case
      // Note: There's no status field to mark as failed in your current schema
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }
}