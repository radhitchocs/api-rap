import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  start() {
    return {
      serverTime: new Date().toString(),
      serviceName: this.configService.get<string>('npm_package_name'),
      appVersion: this.configService.get<string>('npm_package_version'),
    };
  }
}
