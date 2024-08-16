import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreateStockOpnameDto } from '../dto/create-stock-opname.dto';
import { StockOpnameEntity } from '../schema/stock-opname.schema';

@Injectable()
export class StockOpnamesService {
  constructor(
    @InjectModel(StockOpnameEntity.name)
    private readonly stockOpnameModel: PaginateModel<StockOpnameEntity>,
  ) {}

  async create(dto: CreateStockOpnameDto): Promise<StockOpnameEntity> {
    const newStockOpname = new this.stockOpnameModel(dto);
    return newStockOpname.save();
  }

  async get(): Promise<PaginateResult<StockOpnameEntity>> {
    const options = {
      limit: 10,
      sort: {
        created_at: -1,
      },
    };
    return this.stockOpnameModel.paginate({}, options);
  }

  async getById(id: Types.ObjectId): Promise<StockOpnameEntity> {
    return this.stockOpnameModel.findById(id).exec();
  }

  async update(
    id: Types.ObjectId,
    dto: CreateStockOpnameDto,
  ): Promise<StockOpnameEntity> {
    return this.stockOpnameModel.findOneAndUpdate(
      { _id: id },
      { $set: dto },
      { new: true },
    );
  }

  async delete(id: Types.ObjectId) {
    return this.stockOpnameModel.findOneAndUpdate(
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
