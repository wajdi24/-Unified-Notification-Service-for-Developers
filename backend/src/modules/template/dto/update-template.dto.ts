import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TemplateType } from '@prisma/client';

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(TemplateType)
  type?: TemplateType;

}
