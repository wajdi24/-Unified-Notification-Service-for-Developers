import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsPhoneNumber('US')
  @IsOptional() // Allow the phone field to be undefined or omitted
  phone?: string | null; // Allows null or undefined
  @IsOptional()
  @IsString()
  avatar?: string;
}
