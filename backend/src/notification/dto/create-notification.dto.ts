import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeliveryType } from '@prisma/client';
export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsEnum(DeliveryType)
  channel: DeliveryType;

  @IsOptional()
  @IsString()
  templateId?: string;
}


