import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreateStockOpnameDto } from '../dto/create-stock-opname.dto';
import { StockOpnameEntity } from '../schema/stock-opname.schema';
import { ProductsService } from 'src/module/products/service/products.service';
import { UserService } from 'src/module/users/service/users.service';

@Injectable()
export class StockOpnamesService {
  constructor(
    @InjectModel(StockOpnameEntity.name)
    private readonly stockOpnameModel: PaginateModel<StockOpnameEntity>,
    private readonly productsService: ProductsService,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreateStockOpnameDto): Promise<StockOpnameEntity> {
    const product = await this.productsService.getById(
      new Types.ObjectId(dto.product_id),
    );
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${dto.product_id}" not found`,
      );
    }

    const user = await this.userService.getUser(dto.user_id);
    if (!user) {
      throw new NotFoundException(`User with ID "${dto.user_id}" not found`);
    }

    const newStockOpname = new this.stockOpnameModel({
      ...dto,
      product_id: new Types.ObjectId(dto.product_id),
      user_id: new Types.ObjectId(dto.user_id),
    });
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
