import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import omit from 'just-omit';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_STRATEGY_NAME } from '@/common/const/index.const';
import { PayloadType } from '@/common/type/payload.type';
import { ConfigService } from '@/config/config.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWTSecret as string,
    });
  }

  async validate(payload: PayloadType) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    return user && omit(user, ['hash']);
  }
}
