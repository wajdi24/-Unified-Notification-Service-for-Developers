import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TemplateType } from '@prisma/client';

export class CreateTemplateDto {
  @IsString()
  title: string;

  @IsString()
  subject: string;

  @IsString()   
  body: string;

  @IsEnum(TemplateType)
  type: TemplateType;

}
