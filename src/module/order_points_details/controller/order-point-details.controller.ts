import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ResponseMessage } from 'src/decorator/response.decorator';
import { OrderPointDetailsService } from '../service/order-point-details.service';
import { CreateOrderPointDetailDto } from '../dto/create-order-point-detail.dto';
import { GetOrderPointDetailDto } from '../dto/get-order-point-detail.dto';

@Controller('order-point-details')
export class OrderPointDetailsController {
  constructor(
    private readonly orderPointDetailsService: OrderPointDetailsService,
  ) {}

  @Post()
  @ResponseMessage('Order point detail has been created successfully.')
  async create(@Body() dto: CreateOrderPointDetailDto) {
    const result = await this.orderPointDetailsService.create(dto);
    return result;
  }

  @Get()
  @ResponseMessage('Successfully retrieved order point details!')
  async get(@Query() dto: GetOrderPointDetailDto) {
    const result = await this.orderPointDetailsService.get(dto);
    return result;
  }
}
