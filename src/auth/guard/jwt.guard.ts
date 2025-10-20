import { AuthGuard } from '@nestjs/passport';

import { JWT_STRATEGY_NAME } from '@/common/const/index.const';

export class JWTGuard extends AuthGuard(JWT_STRATEGY_NAME) {
  constructor() {
    super();
  }
}
