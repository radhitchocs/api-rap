import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { OrderDetailsService } from '../service/order-details.service';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved order details!')
  async get() {
    const result = await this.orderDetailsService.get();
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

  @Post()
  @ResponseMessage('Order detail has been created successfully.')
  async create(@Body() dto: CreateOrderDetailDto) {
    const result = await this.orderDetailsService.create(dto);
    return result;
  }

  @Patch('/:orderId')
  @ResponseMessage('Order detail has been updated successfully.')
  async update(
    @Param('orderId') orderId: string,
    @Body() dto: CreateOrderDetailDto,
  ) {
    const updateData = { ...dto };

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    return this.orderDetailsService.update(
      new Types.ObjectId(orderId),
      updateData,
    );
  }

  @Delete('/:orderId')
  @ResponseMessage('Order detail has been deleted successfully.')
  async delete(@Param('orderId') orderId: string) {
    return this.orderDetailsService.delete(new Types.ObjectId(orderId));
  }
}
