import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JwtModuleOptions,
  JwtOptionsFactory,
} from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
@Injectable()
export class JwtAuthConfig implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    return {
      publicKey: fs.readFileSync('src/config/auth/public.key'),
      privateKey: fs.readFileSync('src/config/auth/private.key'),
      signOptions: {
        algorithm: 'RS256',
      },
    };
  }
}
