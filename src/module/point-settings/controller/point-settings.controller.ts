// src/module/point-settings/controller/point-settings.controller.ts

import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PointSettingsService } from '../service/point-settings.service';
import { CreatePointSettingsDto } from '../dto/create-point-settings.dto';

@Controller('point-settings')
export class PointSettingsController {
  constructor(private readonly pointSettingsService: PointSettingsService) {}

  @Post()
  async create(@Body() dto: CreatePointSettingsDto) {
    return this.pointSettingsService.create(dto);
  }

  @Get()
  async get(@Query('id') id: string) {
    return this.pointSettingsService.findOne(id);
  }
}
