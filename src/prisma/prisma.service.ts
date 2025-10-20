import { Injectable } from '@nestjs/common';

import { PrismaClient } from 'generated/prisma';

import { ConfigService } from '@/config/config.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.databaseUrl,
        },
      },
    });
  }
}
