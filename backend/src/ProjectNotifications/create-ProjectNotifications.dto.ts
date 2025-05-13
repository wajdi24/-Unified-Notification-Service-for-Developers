import { IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;


  @IsString()
  projectId: string;


  @IsString()
  externalId: string;
}
