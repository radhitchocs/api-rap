import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RestService } from './service/rest.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: parseInt(
          configService.get<string>('PUBLIC_EXPERIENCE_API_HTTP_TIMEOUT'),
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RestService],
  exports: [RestService],
})
export class RestModule {}
