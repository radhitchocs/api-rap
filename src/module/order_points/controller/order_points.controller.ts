import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ResponseMessage } from 'src/decorator/response.decorator';

import { CreateOrderPointDto } from '../dto/create-order_point.dto';
import { GetOrderPointDto } from '../dto/get-order_point.dto';
import { OrderPointsService } from '../service/order_points.service';

@Controller('order-points')
export class OrderPointsController {
  constructor(private readonly orderPointsService: OrderPointsService) {}

  @Post()
  @ResponseMessage('Order point has been created successfully.')
  async create(@Body() dto: CreateOrderPointDto) {
    const result = await this.orderPointsService.create(dto);
    return result;
  }

  @Get()
  @ResponseMessage('Successfully retrieved order points!')
  async get(@Query() dto: GetOrderPointDto) {
    const result = await this.orderPointsService.get(dto);
    return result;
  }
}
