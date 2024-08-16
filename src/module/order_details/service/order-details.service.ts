import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { OrderDetailEntity } from '../schema/order-detail.schema';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
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
    const product = await this.productsService.getById(
      new Types.ObjectId(dto.productId),
    );
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${dto.productId}" not found`,
      );
    }

    const amount = dto.price * dto.quantity - dto.discount;

    const newOrderDetail = new this.orderDetailModel({
      orderId: dto.orderId,
      productId: dto.productId,
      quantity: dto.quantity,
      price: dto.price,
      discount: dto.discount,
      amount: amount,
    });

    return newOrderDetail.save();
  }

  async get(): Promise<PaginateResult<OrderDetailEntity>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };

    return this.orderDetailModel.paginate({}, options);
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

    const amount = (dto.price - dto.discount) * dto.quantity;

    return await this.orderDetailModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...dto,
            amount: amount, // Update amount berdasarkan perhitungan baru
          },
        },
        { new: true },
      )
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
