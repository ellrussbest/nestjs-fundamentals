import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { JWTGuard } from '@/auth/guard/jwt.guard';
import { User } from '@/common/decorator/user.decorator';
import type { PayloadType } from '@/common/type/payload.type';
import { EditUserDto } from '@/user/dto/edit-user.dto';
import { UserService } from '@/user/user.service';

@UseGuards(JWTGuard)
@Controller('users')
export class UserController {
  constructor(private user: UserService) {}

  @Get('me')
  getMe(@User() user: PayloadType) {
    return user;
  }

  @Get('email')
  getEmail(@User('email') email: string) {
    return { email };
  }

  @Patch()
  editUser(@User('id') userId: number, @Body() dto: EditUserDto) {
    return this.user.editUser({ userId, dto });
  }
}
