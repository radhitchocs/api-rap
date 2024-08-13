// src/module/point-settings/point-settings.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PointSettingsEntity,
  PointSettingsSchema,
} from './schema/point-settings.schema';
import { PointSettingsController } from './controller/point-settings.controller';
import { PointSettingsService } from './service/point-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PointSettingsEntity.name, schema: PointSettingsSchema },
    ]),
  ],
  controllers: [PointSettingsController],
  providers: [PointSettingsService],
  exports: [PointSettingsService],
})
export class PointSettingsModule {}
