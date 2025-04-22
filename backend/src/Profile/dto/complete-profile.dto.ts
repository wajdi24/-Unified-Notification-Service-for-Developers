// src/auth/dto/complete-profile.dto.ts
import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CompleteProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber('US')
  @IsOptional() // Allow the phone field to be undefined or omitted
  phone?: string | null; // Allows null or undefined

  @IsString()
  @IsOptional()
  avatar?: string;  // إذا كنت ترغب في إضافة صورة الشخصية
}
