import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // ✅ Get current user info
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        isProfileCompleted: true,
        verified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ✅ Signup logic
  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomUUID();

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        avatar: '',
        isProfileCompleted: false,
        verified: false,
        verificationToken,
      },
    });

    await this.mailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'User registered successfully. Please verify your email.' };
  }

  // ✅ Signin logic
  async signin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('User not found');
    if (!user.verified) throw new BadRequestException('Email not verified');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const accessToken = this.jwtService.sign({ userId: user.id });

    return { accessToken, isProfileCompleted: user.isProfileCompleted };
  }

  // ✅ Email verification
  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) throw new BadRequestException('Invalid or expired token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  // ✅ Forgot password
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const resetToken = randomUUID();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await this.mailService.sendResetPasswordEmail(email, resetToken);

    return { message: 'Password reset link sent to your email.' };
  }

  // ✅ Reset password
  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  }

  // ✅ Complete profile
  async completeProfile(
    userId: string,
    body: {
      phone: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    },
  ) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          avatar: body.avatar || '',
          isProfileCompleted: true,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to complete profile');
    }
  }
  // ✅ Update profile
async updateProfile(
  userId: string,
  body: {
    phone?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  },
) {
  try {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: body.firstName ?? user.firstName,
        lastName: body.lastName ?? user.lastName,
        phone: body.phone ?? user.phone,
        avatar: body.avatar ?? user.avatar,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new InternalServerErrorException('Failed to update profile');
  }
}

}
