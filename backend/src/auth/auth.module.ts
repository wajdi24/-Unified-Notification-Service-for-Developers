import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { JwtStrategy } from './jwt.strategy'; // تأكد من أنك ضايفه هنا
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Module({
  imports: [
    ConfigModule, // For accessing environment variables
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '1h' }, // Set your JWT expiration time here
        };
      },
    }),
  ],
  controllers: [AuthController], 
  providers: [
    AuthService, 
    PrismaService, 
    MailService,
    JwtStrategy, // Ensure this is included for strategy registration
  ],
})
export class AuthModule {}
