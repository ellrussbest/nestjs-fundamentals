import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreateBookmarkDto } from '@/bookmark/dto/create-bookmark.dto';
import { EditBookmarkDto } from '@/bookmark/dto/edit-bookmark.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById({
    userId,
    bookmarkId,
  }: {
    userId: number;
    bookmarkId: number;
  }) {
    return this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  createBookmark({ userId, dto }: { userId: number; dto: CreateBookmarkDto }) {
    return this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async editBookmarkById({
    userId,
    bookmarkId,
    dto: data,
  }: {
    bookmarkId: number;
    userId: number;
    dto: EditBookmarkDto;
  }) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.bookmark.update({
      where: {
        userId,
        id: bookmarkId,
      },
      data,
    });
  }

  async deleteBookmarkById({
    userId,
    bookmarkId,
  }: {
    userId: number;
    bookmarkId: number;
  }) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.bookmark.delete({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }
}
