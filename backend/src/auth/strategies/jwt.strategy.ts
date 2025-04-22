// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service'; // أو اسم السيرفيس الذي يتعامل مع الـ users

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService, // التأكد من أن الـ UserService موجود لديك
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET') || 'defaultsecretkey', // ضع هنا القيمة الافتراضية إذا كانت غير موجودة
    });
  }

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Validate the payload and return the user
   * @param payload The payload extracted from the JWT
   * @returns The user found with the payload.sub
   */
/*******  95405c2c-8c5e-43c2-8480-7a4c13d7dfed  *******/  async validate(payload: any) {
    // هنا يمكنك إضافة منطق للتحقق من الـ payload
    const user = await this.userService.findById(payload.sub);
    return user;  // إعادة الـ user
  }
}
