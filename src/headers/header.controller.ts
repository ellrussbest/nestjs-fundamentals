import { Get, Headers } from '@nestjs/common';

import { HeadersDto } from '@/headers/headers.dto';
import { RequestHeader } from '@/common/decorator/request-header.decorator';

export class HeaderController {
  @Get()
  getHeader(@RequestHeader() headers: HeadersDto) {}
}
