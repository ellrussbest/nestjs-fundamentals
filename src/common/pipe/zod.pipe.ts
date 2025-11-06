import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import * as z from 'zod';

@Injectable()
export class ZodPipe<T> implements PipeTransform {
  constructor(private readonly schema: z.ZodType<T>) {}

  transform(value: unknown) {
    const res = this.schema.safeParse(value);
    if (!res.success) {
      throw new BadRequestException(z.treeifyError(res.error));
    }

    return res.data;
  }
}
