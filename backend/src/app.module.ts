import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PassportModule } from '@nestjs/passport'; // Add PassportModule
import { TemplateModule } from './modules/template/template.module';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { NotificationModule } from './notification/notification.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    AuthModule,
    TemplateModule, // Ensure TemplateModule is added here
    // Load environment variables from .env file
    ConfigModule.forRoot(),
    NotificationModule, // ✅ Add this line

    // PassportModule for JWT strategy
    PassportModule.register({ defaultStrategy: 'jwt' }), // Add PassportModule

    // JWT Module configuration using environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ProjectModule,
    // MailerModule configuration using environment variables
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: false,  // Use false for port 587 with STARTTLS; set true if using port 465
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
        template: {
          // Adjust the path as needed if your templates are in a different location
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AuthController, UserController], // Add TemplateController here if needed
  providers: [AuthService, PrismaService, MailService, UserService],
})
export class AppModule {}
