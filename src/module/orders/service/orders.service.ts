// src/module/orders/service/orders.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateOrderDto } from '../dto/create-order.dto';
import { GetOrderDto } from '../dto/get-order.dto';
import { OrderEntity } from '../schema/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrderEntity.name)
    private readonly orderModel: Model<OrderEntity>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    const newOrder = new this.orderModel(dto);
    return newOrder.save();
  }

  async get(dto: GetOrderDto): Promise<OrderEntity[]> {
    const { page = 1, limit = 10, ...filters } = dto;
    return this.orderModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async getById(orderId: Types.ObjectId): Promise<OrderEntity | null> {
    return this.orderModel.findById(orderId).exec();
  }

  async approveOrder(orderId: Types.ObjectId): Promise<OrderEntity | null> {
    return this.orderModel
      .findByIdAndUpdate(orderId, { payment_status: 'approved' }, { new: true })
      .exec();
  }

  async cancelOrder(orderId: Types.ObjectId): Promise<OrderEntity | null> {
    return this.orderModel
      .findByIdAndUpdate(
        orderId,
        { payment_status: 'cancelled' },
        { new: true },
      )
      .exec();
  }

  async update(
    orderId: Types.ObjectId,
    dto: CreateOrderDto,
  ): Promise<OrderEntity> {
    const order = await this.orderModel.findById(orderId).lean();
    if (!order) {
      throw new Error('Order not found');
    }
    return await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      {
        $set: dto,
      },
      { new: true },
    );
  }

  async delete(orderId: Types.ObjectId) {
    return await this.orderModel.findByIdAndUpdate(
      { _id: orderId },
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
