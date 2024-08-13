import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { OrderPointEntity } from '../schema/order_point.schema';

import { CreateOrderPointDto } from '../dto/create-order_point.dto';
import { GetOrderPointDto } from '../dto/get-order_point.dto';

@Injectable()
export class OrderPointsService {
  constructor(
    @InjectModel(OrderPointEntity.name)
    private orderPointModel: PaginateModel<OrderPointEntity>,
  ) {}

  async create(dto: CreateOrderPointDto): Promise<OrderPointEntity> {
    const newOrderPoint = new this.orderPointModel(dto);
    return newOrderPoint.save();
  }

  async get(dto: GetOrderPointDto): Promise<PaginateResult<OrderPointEntity>> {
    const { order_id, customer_id } = dto;
    const filter: any = {};
    if (order_id) filter.order_id = order_id;
    if (customer_id) filter.customer_id = customer_id;

    return this.orderPointModel.paginate(filter, {
      sort: { created_at: -1 },
      limit: 10,
    });
  }
}
