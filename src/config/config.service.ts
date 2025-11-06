import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get env() {
    return {
      dbUrl: this.configService.get<string>('DATABASE_URL'),
      dbUsername: this.configService.get<string>('DATABASE_USERNAME'),
      dbUserPassword: this.configService.get<string>('DATABASE_USER_PASSWORD'),
      dbName: this.configService.get<string>('DATABASE_NAME'),
      dbPort: this.configService.get<number>('DATABASE_PORT'),
      JWTSecret: this.configService.get<string>('JWT_SECRET'),
      baseUrl: this.configService.get<string>('BASE_URL'),
    };
  }
}
