// src/module/point-settings/service/point-settings.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PointSettingsEntity } from '../schema/point-settings.schema';
import { CreatePointSettingsDto } from '../dto/create-point-settings.dto';

@Injectable()
export class PointSettingsService {
  constructor(
    @InjectModel(PointSettingsEntity.name)
    private readonly pointSettingsModel: Model<PointSettingsEntity>,
  ) {}

  async create(dto: CreatePointSettingsDto): Promise<PointSettingsEntity> {
    const newPointSettings = new this.pointSettingsModel(dto);
    return newPointSettings.save();
  }

  async findOne(id: string): Promise<PointSettingsEntity> {
    return this.pointSettingsModel.findById(id).exec();
  }
}
