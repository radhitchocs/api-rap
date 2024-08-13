import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateResult, PaginateModel, Types } from 'mongoose';
import { CreateStockOpnameDto } from '../dto/create-stock-opname.dto';
import { GetStockOpnameDto } from '../dto/get-stock-opname.dto';
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

  async get(
    dto: GetStockOpnameDto,
  ): Promise<PaginateResult<StockOpnameEntity>> {
    const { page = 1, limit = 10, warehouse } = dto;
    const options = {
      page,
      limit,
      sort: { created_at: -1 },
    };

    const query = warehouse ? { warehouse } : {};
    return this.stockOpnameModel.paginate(query, options);
  }

  async getById(id: Types.ObjectId): Promise<StockOpnameEntity> {
    return this.stockOpnameModel.findById(id).exec();
  }
}
