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
      new Types.ObjectId(dto.product_id),
    );
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${dto.product_id}" not found`,
      );
    }

    const amount = dto.price * dto.qty - (dto.disc || 0);

    const newOrderDetail = new this.orderDetailModel({
      order_id: dto.order_id,
      product_id: dto.product_id,
      qty: dto.qty,
      price: dto.price,
      disc: dto.disc || 0,
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

  async getByOrderId(order_id: Types.ObjectId): Promise<OrderDetailEntity[]> {
    return this.orderDetailModel.find({ order_id }).exec();
  }

  async update(
    id: Types.ObjectId,
    dto: CreateOrderDetailDto,
  ): Promise<OrderDetailEntity> {
    const orderDetail = await this.orderDetailModel.findById(id).exec();
    if (!orderDetail) {
      throw new NotFoundException(`OrderDetail with ID "${id}" not found`);
    }

    if (dto.order_id) {
      const order = await this.ordersService.getById(
        new Types.ObjectId(dto.order_id),
      );
      if (!order) {
        throw new NotFoundException(
          `Order with ID "${dto.order_id}" not found`,
        );
      }
    }

    if (dto.product_id) {
      const product = await this.productsService.getById(
        new Types.ObjectId(dto.product_id),
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID "${dto.product_id}" not found`,
        );
      }
    }

    const amount = dto.price * dto.qty - (dto.disc || 0);

    return await this.orderDetailModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...dto,
            amount: amount,
          },
        },
        { new: true },
      )
      .exec();
  }

  async delete(order_id: Types.ObjectId): Promise<OrderDetailEntity> {
    return await this.orderDetailModel.findOneAndUpdate(
      { _id: order_id },
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
