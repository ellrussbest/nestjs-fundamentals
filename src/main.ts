import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws an error if unknown properties are present
      always: true, // always includes default values from DTOs
      transform: true, // auto-transforms payloads to DTO instances
      forbidUnknownValues: true, // helps with undefined bodies
      transformOptions: {
        enableImplicitConversion: true, // allows primitive type conversion (e.g., string -> number)
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
