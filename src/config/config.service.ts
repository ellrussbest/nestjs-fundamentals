import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get databaseUrl(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
  }

  get databaseUsername(): string | undefined {
    return this.configService.get<string>('DATABASE_USERNAME');
  }

  get databaseUserPassword(): string | undefined {
    return this.configService.get<string>('DATABASE_USER_PASSWORD');
  }

  get databaseName(): string | undefined {
    return this.configService.get<string>('DATABASE_NAME');
  }

  get databasePort(): number | undefined {
    return this.configService.get<number>('DATABASE_PORT');
  }

  get JWTSecret(): string | undefined {
    return this.configService.get<string>('JWT_SECRET');
  }
}
