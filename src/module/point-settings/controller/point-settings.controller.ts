import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { ResponseMessage } from 'src/decorator/response.decorator';
import { PointSettingsService } from '../service/point-settings.service';
import { CreatePointSettingsDto } from '../dto/create-point-settings.dto';
import { Types } from 'mongoose';
import { PointSettingsEntity } from '../schema/point-settings.schema';

@Controller('point-settings')
export class PointSettingsController {
  constructor(private readonly pointSettingsService: PointSettingsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved point settings!')
  async get(@Query() dto: PointSettingsEntity) {
    const result = await this.pointSettingsService.get(dto);
    return result;
  }

  @Get('/:id')
  @ResponseMessage('Successfully retrieved details of point setting!')
  async getById(@Param('id') id: string) {
    const result = await this.pointSettingsService.getById(
      new Types.ObjectId(id),
    );
    return result;
  }

  @Post()
  @ResponseMessage('Point setting has been created successfully.')
  async create(@Body() dto: CreatePointSettingsDto) {
    const result = await this.pointSettingsService.create(dto);
    return result;
  }

  @Patch('/:id')
  @ResponseMessage('Point setting has been updated successfully.')
  async update(@Param('id') id: string, @Body() dto: CreatePointSettingsDto) {
    const updateData = {
      ...dto,
    };

    return this.pointSettingsService.update(new Types.ObjectId(id), updateData);
  }

  @Delete('/:id')
  @ResponseMessage('Point setting has been deleted successfully.')
  async delete(@Param('id') id: string) {
    return this.pointSettingsService.delete(new Types.ObjectId(id));
  }
}
