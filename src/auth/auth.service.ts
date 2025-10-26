import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { AuthDto } from '@/auth/dto/auth.dto';
import { PayloadType } from '@/common/type/payload.type';
import { ConfigService } from '@/config/config.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return this.signToken({
        email: user.email,
        sub: user.id,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            throw new ForbiddenException('Credentials taken!');
          default:
            throw err;
        }
      }

      throw err;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect!');

    const matches = await argon.verify(user.hash, dto.password);

    if (!matches) throw new ForbiddenException('Credentials incorrect!');

    return this.signToken({
      email: user.email,
      sub: user.id,
    });
  }

  async signToken(payload: PayloadType) {
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.JWTSecret,
    });

    return { access_token };
  }
}
