import { Test } from '@nestjs/testing';

import { AppModule } from '@/app.module';

describe('App e2e', () => {
  beforeAll(async () => {
    const moduleref = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });
  it.todo('should pass');
});
