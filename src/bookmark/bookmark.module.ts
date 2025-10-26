import { Module } from '@nestjs/common';

import { BookmarkController } from '@/bookmark/bookmark.controller';
import { BookmarkService } from '@/bookmark/bookmark.service';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
