import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreateOrderPointDetailDto } from '../dto/create-order-point-detail.dto';
import { OrderPointDetailEntity } from '../schema/order-point-detail.schema';
import { OrderPointDetailInterface } from '../interface/order-point-detail.interface';
@Injectable()
export class OrderPointDetailsService {
  constructor(
    @InjectModel(OrderPointDetailEntity.name)
    private orderPointDetailModel: PaginateModel<OrderPointDetailEntity>,
  ) {}

  async get(): Promise<PaginateResult<OrderPointDetailInterface>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };
    return this.orderPointDetailModel.paginate({}, options);
  }

  async getById(id: Types.ObjectId): Promise<OrderPointDetailEntity> {
    return this.orderPointDetailModel.findById(id).exec();
  }

  async create(
    dto: CreateOrderPointDetailDto,
  ): Promise<OrderPointDetailEntity> {
    const newOrderPointDetail = new this.orderPointDetailModel(dto);
    return newOrderPointDetail.save();
  }

  async update(
    id: Types.ObjectId,
    dto: CreateOrderPointDetailDto,
  ): Promise<OrderPointDetailEntity> {
    const orderPointDetail = await this.orderPointDetailModel
      .findById(id)
      .lean();

    if (!orderPointDetail) {
      throw new Error('Order point detail not found');
    }

    return await this.orderPointDetailModel.findOneAndUpdate(
      { _id: id },
      {
        $set: dto,
      },
      { new: true },
    );
  }

  async delete(id: Types.ObjectId): Promise<OrderPointDetailEntity> {
    return await this.orderPointDetailModel.findOneAndUpdate(
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
