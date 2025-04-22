import {
    Controller,
    Post,
    Put,
    Body,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { ProfileService } from './profile.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { CompleteProfileDto } from './dto/complete-profile.dto';
  import { UpdateProfileDto } from './dto/update-profile.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('auth')
  export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
  
    // Endpoint to complete the user profile
    @UseGuards(JwtAuthGuard)
    @Post('complete-profile')
    @UseInterceptors(
      FileInterceptor('avatar', {
        storage: diskStorage({
          destination: './uploads/avatars', // Set the folder where the avatar images will be stored
          filename: (req, file, callback) => {
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, uniqueName + extname(file.originalname)); // Generate a unique file name
          },
        }),
      }),
    )
    async completeProfile(
      @Request() req,
      @Body() body: CompleteProfileDto, // Data sent with the request
      @UploadedFile() file: Express.Multer.File, // Uploaded avatar file
    ) {
      const userId = req.user.userId; // Extract user ID from the JWT token
      const avatar = file ? file.filename : null; // If a file is uploaded, use its filename as the avatar
      return this.profileService.completeProfile(userId, body, avatar); // Call service method to complete the profile
    }
  
    // Endpoint to update the user profile
    @UseGuards(JwtAuthGuard)
    @Put('update-profile')
    async updateProfile(@Request() req, @Body() body: UpdateProfileDto) {
      const userId = req.user.userId; // Extract user ID from the JWT token
      return this.profileService.updateProfile(userId, body); // Call service method to update the profile
    }
  }
  