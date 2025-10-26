import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JWTGuard } from '@/auth/guard/jwt.guard';
import { BookmarkService } from '@/bookmark/bookmark.service';
import { CreateBookmarkDto } from '@/bookmark/dto/create-bookmark.dto';
import { EditBookmarkDto } from '@/bookmark/dto/edit-bookmark.dto';
import { User } from '@/common/decorator/user.decorator';

@UseGuards(JWTGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmark: BookmarkService) {}

  @Get()
  getBookmarks(@User('id') userId: number) {
    return this.bookmark.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmark.getBookmarkById({
      bookmarkId,
      userId,
    });
  }

  @Post()
  createBookmark(@User('id') userId: number, @Body() dto: CreateBookmarkDto) {
    return this.bookmark.createBookmark({
      dto,
      userId,
    });
  }

  @Patch(':id')
  editBookmarkById(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmark.editBookmarkById({
      bookmarkId,
      dto,
      userId,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmark.deleteBookmarkById({
      bookmarkId,
      userId,
    });
  }
}
