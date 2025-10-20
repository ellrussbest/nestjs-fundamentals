import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { toError } from '@/common/utils/error.util';
import { ConfigService } from '@/config/config.service';
import { EnvSchema } from '@/config/schema/env.schema';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: '.env',
      validate: (config: unknown) => {
        try {
          return EnvSchema.parse(config);
        } catch (err) {
          throw new Error(
            `Configuration validation error: ${toError(err).message}`,
          );
        }
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
