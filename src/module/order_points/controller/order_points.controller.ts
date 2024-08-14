import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ResponseMessage } from 'src/decorator/response.decorator';

import { CreateOrderPointDto } from '../dto/create-order_point.dto';
import { GetOrderPointDto } from '../dto/get-order_point.dto';
import { OrderPointsService } from '../service/order_points.service';
import { Types } from 'mongoose';

@Controller('order-points')
export class OrderPointsController {
  constructor(private readonly orderPointsService: OrderPointsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved order points!')
  async get(@Query() dto: GetOrderPointDto) {
    const result = await this.orderPointsService.get(dto);
    return result;
  }

  @Get('/:id')
  @ResponseMessage('Successfully retrieved order point details!')
  async getById(@Param('id') id: string) {
    const result = await this.orderPointsService.getById(
      new Types.ObjectId(id),
    );
    return result;
  }

  @Post()
  @ResponseMessage('Order point has been created successfully.')
  async create(@Body() dto: CreateOrderPointDto) {
    const result = await this.orderPointsService.create(dto);
    return result;
  }

  @Patch('/:id')
  @ResponseMessage('Order point has been updated successfully.')
  async update(@Param('id') id: string, @Body() dto: CreateOrderPointDto) {
    const updateData = { ...dto };

    if (!id) {
      throw new Error('Order point ID is required');
    }

    return this.orderPointsService.update(new Types.ObjectId(id), updateData);
  }

  @Delete('/:id')
  @ResponseMessage('Order point has been deleted successfully.')
  async delete(@Param('id') id: string) {
    return this.orderPointsService.delete(new Types.ObjectId(id));
  }
}
