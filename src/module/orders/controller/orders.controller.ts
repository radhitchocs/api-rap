// src/module/orders/controller/orders.controller.ts
import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { Types } from 'mongoose';

import { CreateOrderDto } from '../dto/create-order.dto';
import { GetOrderDto } from '../dto/get-order.dto';
import { OrdersService } from '../service/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const result = await this.ordersService.create(dto);
    return result;
  }

  @Get()
  async get(@Query() dto: GetOrderDto) {
    const result = await this.ordersService.get(dto);
    return result;
  }

  @Get('/:orderId')
  async getById(@Param('orderId') orderId: Types.ObjectId) {
    const result = await this.ordersService.getById(orderId);
    return result;
  }

  @Post('/approve')
  async approveOrder(@Body() dto: { orderId: Types.ObjectId }) {
    const result = await this.ordersService.approveOrder(dto.orderId);
    return result;
  }

  @Post('/cancel')
  async cancelOrder(@Body() dto: { orderId: Types.ObjectId }) {
    const result = await this.ordersService.cancelOrder(dto.orderId);
    return result;
  }
}
