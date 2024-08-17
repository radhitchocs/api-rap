import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { ResponseMessage } from 'src/decorator/response.decorator';
import { PrinterSettingsService } from '../service/printer-settings.service';
import { CreatePrinterSettingsDto } from '../dto/create-printer-settings.dto';
import { Types } from 'mongoose';

@Controller('printer-settings')
export class PrinterSettingsController {
  constructor(
    private readonly printerSettingsService: PrinterSettingsService,
  ) {}

  @Get()
  @ResponseMessage('Successfully retrieved printer settings!')
  async get() {
    const result = await this.printerSettingsService.get();
    return result;
  }

  @Get('/:id')
  @ResponseMessage('Successfully retrieved details of printer setting!')
  async getById(@Param('id') id: string) {
    const result = await this.printerSettingsService.getById(
      new Types.ObjectId(id),
    );
    return result;
  }

  @Post()
  @ResponseMessage('Printer setting has been created successfully.')
  async create(@Body() dto: CreatePrinterSettingsDto) {
    const result = await this.printerSettingsService.create(dto);
    return result;
  }

  @Patch('/:id')
  @ResponseMessage('Printer setting has been updated successfully.')
  async update(@Param('id') id: string, @Body() dto: CreatePrinterSettingsDto) {
    const updateData = {
      ...dto,
    };

    return this.printerSettingsService.update(
      new Types.ObjectId(id),
      updateData,
    );
  }

  @Delete('/:id')
  @ResponseMessage('Printer setting has been deleted successfully.')
  async delete(@Param('id') id: string) {
    return this.printerSettingsService.delete(new Types.ObjectId(id));
  }
}
