import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { OrderDetailEntity } from '../schema/order-detail.schema';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { GetOrderDetailDto } from '../dto/get-order-detail.dto';
import { OrdersService } from 'src/module/orders/service/orders.service';
import { ProductsService } from 'src/module/products/service/products.service';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectModel(OrderDetailEntity.name)
    private readonly orderDetailModel: PaginateModel<OrderDetailEntity>,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
  ) {}

  async create(dto: CreateOrderDetailDto): Promise<OrderDetailEntity> {
    // Ambil orderId dari koleksi orders
    const order = await this.ordersService.getById(
      new Types.ObjectId(dto.orderId),
    );
    if (!order) {
      throw new NotFoundException(`Order with ID "${dto.orderId}" not found`);
    }

    // Ambil productId dari koleksi products
    const product = await this.productsService.getById(
      new Types.ObjectId(dto.productId),
    );
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${dto.productId}" not found`,
      );
    }

    const newOrderDetail = new this.orderDetailModel({
      ...dto,
      orderId: new Types.ObjectId(dto.orderId), // Assign orderId as ObjectId
      productId: new Types.ObjectId(dto.productId), // Assign productId as ObjectId
    });

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

  async update(
    id: Types.ObjectId,
    dto: CreateOrderDetailDto,
  ): Promise<OrderDetailEntity> {
    const orderDetail = await this.orderDetailModel.findById(id).exec();
    if (!orderDetail) {
      throw new NotFoundException(`OrderDetail with ID "${id}" not found`);
    }

    if (dto.orderId) {
      const order = await this.ordersService.getById(
        new Types.ObjectId(dto.orderId),
      );
      if (!order) {
        throw new NotFoundException(`Order with ID "${dto.orderId}" not found`);
      }
    }

    if (dto.productId) {
      const product = await this.productsService.getById(
        new Types.ObjectId(dto.productId),
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID "${dto.productId}" not found`,
        );
      }
    }

    return await this.orderDetailModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
  }

  async delete(orderId: Types.ObjectId): Promise<OrderDetailEntity> {
    return await this.orderDetailModel.findOneAndUpdate(
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
