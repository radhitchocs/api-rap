// src/module/orders/controller/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { CreateOrderDto } from '../dto/create-order.dto';
import { GetOrderDto } from '../dto/get-order.dto';
import { OrdersService } from '../service/orders.service';
import { ResponseMessage } from 'src/decorator/response.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const result = await this.ordersService.create(dto);
    return result;
  }

  @Get()
  @ResponseMessage('Get orders successfully')
  async get(@Query() dto: GetOrderDto) {
    const result = await this.ordersService.get(dto);
    return result;
  }

  @Get('/:orderId')
  @ResponseMessage('Get order by id successfully')
  async getById(@Param('orderId') orderId: Types.ObjectId) {
    const result = await this.ordersService.getById(orderId);
    return result;
  }

  @Post('/approve')
  @ResponseMessage('Approve order successfully')
  async approveOrder(@Body() dto: { orderId: Types.ObjectId }) {
    const result = await this.ordersService.approveOrder(dto.orderId);
    return result;
  }

  @Post('/cancel')
  @ResponseMessage('Cancel order successfully')
  async cancelOrder(@Body() dto: { orderId: Types.ObjectId }) {
    const result = await this.ordersService.cancelOrder(dto.orderId);
    return result;
  }

  @Patch('/:orderId')
  @ResponseMessage('Update order successfully')
  async update(@Param('orderId') orderId: string, @Body() dto: CreateOrderDto) {
    const updateData = { ...dto };

    return this.ordersService.update(new Types.ObjectId(orderId), updateData);
  }

  @Delete('/:orderId')
  @ResponseMessage('Delete order successfully')
  async delete(@Param('orderId') orderId: string) {
    return this.ordersService.delete(new Types.ObjectId(orderId));
  }
}
