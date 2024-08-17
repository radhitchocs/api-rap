import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PrinterSettingsEntity,
  PrinterSettingsSchema,
} from './schema/printer-settings.schema';
import { PrinterSettingsController } from './controller/printer-settings.controller';
import { PrinterSettingsService } from './service/printer-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrinterSettingsEntity.name, schema: PrinterSettingsSchema },
    ]),
  ],
  controllers: [PrinterSettingsController],
  providers: [PrinterSettingsService],
  exports: [PrinterSettingsService],
})
export class PrinterSettingsModule {}
