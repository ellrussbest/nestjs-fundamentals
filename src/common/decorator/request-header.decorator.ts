import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (targetDto, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    const dto = plainToInstance(targetDto, headers, {
      excludeExtraneousValues: true, // exclude values that are not defined inside the targetDto
    });

    await validateOrReject(dto);
    return dto;
  },
);
