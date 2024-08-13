import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { OrderDetailsService } from '../service/order-details.service';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { GetOrderDetailDto } from '../dto/get-order-detail.dto';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post()
  @ResponseMessage('Order detail has been created successfully.')
  async create(@Body() dto: CreateOrderDetailDto) {
    const result = await this.orderDetailsService.create(dto);
    return result;
  }

  @Get()
  @ResponseMessage('Successfully retrieved order details!')
  async get(@Query() dto: GetOrderDetailDto) {
    const result = await this.orderDetailsService.get(dto);
    return result;
  }

  @Get('/:orderId')
  @ResponseMessage(
    'Successfully retrieved order details for the given order ID!',
  )
  async getByOrderId(@Param('orderId') orderId: Types.ObjectId) {
    const result = await this.orderDetailsService.getByOrderId(orderId);
    return result;
  }
}
