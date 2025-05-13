import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  sendEmail(arg0: { to: string; subject: string; template: string; context: { title: string; message: string; }; }) {
      throw new Error('Method not implemented.');
  }
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password من Gmail
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `http://yourfrontend.com/verify-email?token=${token}`;
  
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
          <h2 style="color: #4CAF50;">Verify your email</h2>
          <p>Thank you for signing up. Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };
  
    await this.transporter.sendMail(mailOptions);
  }
  
  async sendResetPasswordEmail(email: string, token: string) {
    const resetPasswordUrl = `http://localhost:5173/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Reset your password',
      text: `Click here to reset your password: ${resetPasswordUrl}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
