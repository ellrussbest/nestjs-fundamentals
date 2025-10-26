import { Injectable } from '@nestjs/common';

import omit from 'just-omit';

import { PrismaService } from '@/prisma/prisma.service';
import { EditUserDto } from '@/user/dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser({ userId, dto: data }: { userId: number; dto: EditUserDto }) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });

    return omit(user, ['hash']);
  }
}
