import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { CreateOrderPointDetailDto } from '../dto/create-order-point-detail.dto';
import { GetOrderPointDetailDto } from '../dto/get-order-point-detail.dto';
import { OrderPointDetailEntity } from '../schema/order-point-detail.schema';

@Injectable()
export class OrderPointDetailsService {
  constructor(
    @InjectModel(OrderPointDetailEntity.name)
    private orderPointDetailModel: PaginateModel<OrderPointDetailEntity>,
  ) {}

  async create(
    dto: CreateOrderPointDetailDto,
  ): Promise<OrderPointDetailEntity> {
    const newOrderPointDetail = new this.orderPointDetailModel(dto);
    return newOrderPointDetail.save();
  }

  async get(
    dto: GetOrderPointDetailDto,
  ): Promise<PaginateResult<OrderPointDetailEntity>> {
    const { order_id, product_id, points_earned } = dto;
    const query: any = {};

    if (order_id) query.order_id = order_id;
    if (product_id) query.product_id = product_id;
    if (points_earned) query.points_earned = points_earned;

    return this.orderPointDetailModel.paginate(query, { page: 1, limit: 10 });
  }
}
