import { Controller, Post, Body, Get, Param, UseGuards, HttpException, HttpStatus, Patch, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto'; // Assuming you will create a DTO for creating users
import { GetUser } from 'src/auth/Decorator/get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password } = createUserDto;

    try {
      const user = await this.userService.createUser(firstName, lastName, email, password);
      return { message: 'User created successfully', user };
    } catch (error) {
      throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get all users (for admin purposes)
  @Get()
  @UseGuards(JwtAuthGuard)  // This ensures that only authenticated users can view the list of users
  async getAllUsers() {
    try {
      const users = await this.userService.getUsers();
      return users;
    } catch (error) {
      throw new HttpException('Error fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update user profile (for complete profile)
  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetUser('userId') userId: string,
        @Body() body: { firstName?: string; lastName?: string; phone?: string; avatar?: string },
  ) {  
    try {
      console.log('Update profile data:', userId);
  
      const updatedUser = await this.userService.completeProfile(userId, body);
  
      return { message: 'Profile updated successfully', user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      throw new HttpException('Failed to update profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
