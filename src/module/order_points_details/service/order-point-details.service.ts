// src/module/order_points_details/service/order-point-details.service.ts

import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { OrderPointDetailEntity } from '../schema/order-point-detail.schema';
import { CreateOrderPointDetailDto } from '../dto/create-order-point-detail.dto';
import { ProductsService } from 'src/module/products/service/products.service';

@Injectable()
export class OrderPointDetailsService {
  constructor(
    @InjectModel(OrderPointDetailEntity.name)
    private readonly orderPointDetailModel: PaginateModel<OrderPointDetailEntity>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async create(
    dto: CreateOrderPointDetailDto,
  ): Promise<OrderPointDetailEntity> {
    const product = await this.productsService.getById(
      new Types.ObjectId(dto.product_id),
    );
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${dto.product_id}" not found`,
      );
    }

    const newOrderPointDetail = new this.orderPointDetailModel({
      order_point_id: new Types.ObjectId(dto.order_point_id),
      product_id: new Types.ObjectId(dto.product_id),
      points_earned: dto.points_earned,
    });

    return newOrderPointDetail.save();
  }

  async get(): Promise<PaginateResult<OrderPointDetailEntity>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };
    return this.orderPointDetailModel.paginate({}, options);
  }

  async getByOrderPointId(
    orderPointId: Types.ObjectId,
  ): Promise<OrderPointDetailEntity[]> {
    return this.orderPointDetailModel
      .find({ order_point_id: orderPointId })
      .exec();
  }

  async update(
    id: Types.ObjectId,
    dto: CreateOrderPointDetailDto,
  ): Promise<OrderPointDetailEntity> {
    const orderPointDetail = await this.orderPointDetailModel
      .findById(id)
      .exec();
    if (!orderPointDetail) {
      throw new NotFoundException(`OrderPointDetail with ID "${id}" not found`);
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

    return this.orderPointDetailModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
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
