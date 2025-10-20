import { Controller, Get, UseGuards } from '@nestjs/common';

import { JWTGuard } from '@/auth/guard/jwt.guard';
import { User } from '@/common/decorator/user.decorator';
import type { PayloadType } from '@/common/type/payload.type';

@UseGuards(JWTGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@User() user: PayloadType) {
    return user;
  }

  @Get('email')
  getEmail(@User('email') email: string) {
    return { email };
  }
}
