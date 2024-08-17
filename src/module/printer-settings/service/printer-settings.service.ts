import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreatePrinterSettingsDto } from '../dto/create-printer-settings.dto';
import { PrinterSettingsEntity } from '../schema/printer-settings.schema';
import { PrinterSettingsInterface } from '../interface/printer-settings.interface';

@Injectable()
export class PrinterSettingsService {
  constructor(
    @InjectModel(PrinterSettingsEntity.name)
    private printerSettingsModel: PaginateModel<PrinterSettingsEntity>,
  ) {}

  async get(): Promise<PaginateResult<PrinterSettingsEntity>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };

    return this.printerSettingsModel.paginate({}, options);
  }

  async getById(id: Types.ObjectId): Promise<PrinterSettingsInterface> {
    return this.printerSettingsModel.findById(id).exec();
  }

  async create(
    dto: CreatePrinterSettingsDto,
  ): Promise<PrinterSettingsInterface> {
    const newPrinterSettings = new this.printerSettingsModel(dto);
    return newPrinterSettings.save();
  }

  async update(
    id: Types.ObjectId,
    dto: CreatePrinterSettingsDto,
  ): Promise<PrinterSettingsInterface> {
    const printerSetting = await this.printerSettingsModel.findById(id).lean();

    if (!printerSetting) {
      throw new Error('Printer setting not found');
    }
    return await this.printerSettingsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: dto,
      },
      { new: true },
    );
  }

  async delete(id: Types.ObjectId) {
    return await this.printerSettingsModel.findOneAndUpdate(
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
