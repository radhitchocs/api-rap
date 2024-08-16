import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreatePointSettingsDto } from '../dto/create-point-settings.dto';
import { PointSettingsEntity } from '../schema/point-settings.schema';
import { PointSettingsInterface } from '../interface/point-settings.interface';

@Injectable()
export class PointSettingsService {
  constructor(
    @InjectModel(PointSettingsEntity.name)
    private pointSettingsModel: PaginateModel<PointSettingsEntity>,
  ) {}

  async get(): Promise<PaginateResult<PointSettingsEntity>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };

    return this.pointSettingsModel.paginate({}, options);
  }

  async getById(id: Types.ObjectId): Promise<PointSettingsInterface> {
    return this.pointSettingsModel.findById(id).exec();
  }

  async create(dto: CreatePointSettingsDto): Promise<PointSettingsInterface> {
    const newPointSettings = new this.pointSettingsModel(dto);
    return newPointSettings.save();
  }

  async update(
    id: Types.ObjectId,
    dto: CreatePointSettingsDto,
  ): Promise<PointSettingsInterface> {
    const pointSetting = await this.pointSettingsModel.findById(id).lean();

    if (!pointSetting) {
      throw new Error('Point setting not found');
    }
    return await this.pointSettingsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: dto,
      },
      { new: true },
    );
  }

  async delete(id: Types.ObjectId) {
    return await this.pointSettingsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );
  }
}
