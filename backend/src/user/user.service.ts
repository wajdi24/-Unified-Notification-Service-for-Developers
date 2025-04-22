import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CompleteProfileDto } from './dto/complete-profile.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Create a new user
  async createUser(firstName: string, lastName: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        firstName,  // Assuming you want to store firstName and lastName separately
        lastName,
        email,
        password: hashedPassword,
      },
    });
  }

  // Get all users (or this could be adjusted to your needs)
  async getUsers() {
    return this.prisma.user.findMany();
  }

  // Find user by ID
  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  // Update user profile (for complete profile)
  async completeProfile(userId: string, data: CompleteProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,  // Update firstName if provided
        lastName: data.lastName,    // Update lastName if provided
        phone: data.phone,          // Update phone if provided
        avatar: data.avatar,        // Update avatar if provided
      },
    });
  }
}
