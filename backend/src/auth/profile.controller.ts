import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
/*   @Post('complete-profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads', // Folder to save files
        filename: (req, file, callback) => {
          const fileExtension = extname(file.originalname);
          callback(null, `${Date.now()}${fileExtension}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // Set file size limit (2MB)
    }),
  )
  async completeProfile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    // Handle the profile completion logic with the uploaded file
  } */
}
