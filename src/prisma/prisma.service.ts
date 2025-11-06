import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { ConfigService } from '@/config/config.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.env.dbUrl,
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.user.deleteMany(),
      this.bookmark.deleteMany(),
    ]);
  }
}
