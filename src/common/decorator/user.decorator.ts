import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { User as PrismaUser } from 'generated/prisma';

export const User = createParamDecorator<
  keyof PrismaUser | undefined,
  PrismaUser | PrismaUser[keyof PrismaUser] | undefined
>((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user?: PrismaUser }>();
  const user = request.user;

  if (!user) return undefined;

  return data ? user[data] : user;
});
