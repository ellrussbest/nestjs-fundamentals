import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { BookmarkModule } from '@/bookmark/bookmark.module';
import { ConfigModule } from '@/config/config.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
