import { Injectable } from '@nestjs/common';

import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://myuser:mypassword@localhost:5432/mydatabase',
        },
      },
    });
  }
}
