import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Request, Response } from 'express';
import { GetUser } from './Decorator/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Sign up route
  @Post('signup')
  async signup(
    @Body()
    body: { email: string; password: string; firstName: string; lastName: string; phone?: string },
  ) {
    const { email, password, firstName, lastName, phone } = body;
    const phoneToUse = phone || '';
    return this.authService.signup(email, password, firstName, lastName, phoneToUse);
  }

  // ✅ Sign in route
  @Post('signin')
  async signin(@Body() body: { email: string; password: string }) {
    return this.authService.signin(body.email, body.password);
  }

  // ✅ Email verification
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // ✅ Forgot password
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  // ✅ Reset password
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  // ✅ Logout
  @Post('logout')
  async logout( @Res() res: Response) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // ✅ Get current user info
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@GetUser("userId") userId: string) {
    return this.authService.getMe(userId);
  }

  // ✅ Complete profile
  @Post('complete-profile')
  @UseGuards(JwtAuthGuard)
  async completeProfile(
    @GetUser("userId") userId:string,
    @Body() body: { firstName?: string; lastName?: string; phone?: string; avatar?: string },
  ) {

    if (!body.firstName || !body.lastName || !body.phone) {
      throw new HttpException('First name, last name, and phone number are required', HttpStatus.BAD_REQUEST);
    }

    if (body.avatar && !/^https?:\/\//.test(body.avatar) && !/^data:image\/[a-z]+;base64,/.test(body.avatar)) {
      throw new HttpException('Invalid avatar format', HttpStatus.BAD_REQUEST);
    }

    try {
      const updatedUser = await this.authService.completeProfile(userId, {
        firstName: body.firstName!,
        lastName: body.lastName!,
        phone: body.phone,
        avatar: body.avatar,
      });
      return { message: 'Profile updated successfully', user: updatedUser };
    } catch (error) {
      throw new HttpException('Failed to update profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
