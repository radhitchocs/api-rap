import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateOrderDto } from '../dto/create-order.dto';
import { GetOrderDto } from '../dto/get-order.dto';
import { OrderEntity } from '../schema/order.schema';
import { CustomersService } from 'src/module/customers/service/customers.service';
import { UserService } from 'src/module/users/service/users.service';
import { PaymentMethodsService } from 'src/module/payment-methods/service/payment-methods.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrderEntity.name)
    private readonly orderModel: Model<OrderEntity>,
    private readonly customersService: CustomersService,
    private readonly userService: UserService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    const customer = await this.customersService.getById(
      new Types.ObjectId(dto.customer_id),
    );
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID "${dto.customer_id}" not found`,
      );
    }

    const user = await this.userService.getUser(dto.user_id);
    if (!user) {
      throw new NotFoundException(`User with ID "${dto.user_id}" not found`);
    }

    const payment_method = await this.paymentMethodsService.getById(
      dto.payment_method_id,
    );
    if (!payment_method) {
      throw new NotFoundException(
        `Payment method with ID "${dto.payment_method_id}" not found`,
      );
    }

    const newOrder = new this.orderModel({
      ...dto,
      customer_id: new Types.ObjectId(dto.customer_id),
      user_id: new Types.ObjectId(dto.user_id),
      payment_method_id: new Types.ObjectId(dto.payment_method_id),
    });

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
      throw new NotFoundException('Order not found');
    }

    if (dto.customer_id) {
      const customer = await this.customersService.getById(
        new Types.ObjectId(dto.customer_id),
      );
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID "${dto.customer_id}" not found`,
        );
      }
      // We keep dto.customer_id as is, since it's already a string
    }

    if (dto.user_id) {
      const user = await this.userService.getUser(dto.user_id);
      if (!user) {
        throw new NotFoundException(`User with ID "${dto.user_id}" not found`);
      }
      // We keep dto.user_id as is, since it's already a string
    }

    if (dto.payment_method_id) {
      const payment_method = await this.paymentMethodsService.getById(
        dto.payment_method_id,
      );
      if (!payment_method) {
        throw new NotFoundException(
          `Payment method with ID "${dto.payment_method_id}" not found`,
        );
      }
      // We keep dto.payment_method_id as is, since it's already a string
    }

    return await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: dto },
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
