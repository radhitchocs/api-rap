import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { OrderDetailEntity } from '../schema/order-detail.schema';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { GetOrderDetailDto } from '../dto/get-order-detail.dto';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectModel(OrderDetailEntity.name)
    private readonly orderDetailModel: PaginateModel<OrderDetailEntity>,
  ) {}

  async create(dto: CreateOrderDetailDto): Promise<OrderDetailEntity> {
    const newOrderDetail = new this.orderDetailModel(dto);
    return newOrderDetail.save();
  }

  async get(dto: GetOrderDetailDto): Promise<OrderDetailEntity[]> {
    const query = {};
    if (dto.orderId) {
      query['orderId'] = dto.orderId;
    }

    return this.orderDetailModel.find(query).exec();
  }

  async getByOrderId(orderId: Types.ObjectId): Promise<OrderDetailEntity[]> {
    return this.orderDetailModel.find({ orderId }).exec();
  }
}
