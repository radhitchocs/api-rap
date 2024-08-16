import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ResponseMessage } from 'src/decorator/response.decorator';
import { OrderPointDetailsService } from '../service/order-point-details.service';
import { CreateOrderPointDetailDto } from '../dto/create-order-point-detail.dto';
import { Types } from 'mongoose';

@Controller('order-point-details')
export class OrderPointDetailsController {
  constructor(
    private readonly orderPointDetailsService: OrderPointDetailsService,
  ) {}

  // Ubah method get:
  @Get()
  @ResponseMessage('Successfully retrieved order point details!')
  async get() {
    const result = await this.orderPointDetailsService.get();
    return result;
  }

  // Ubah method getById:
  @Get('/:id')
  @ResponseMessage('Successfully retrieved order point detail!')
  async getById(@Param('id') id: string) {
    const result = await this.orderPointDetailsService.getByOrderPointId(
      new Types.ObjectId(id),
    );
    return result;
  }

  @Post()
  @ResponseMessage('Order point detail has been created successfully.')
  async create(@Body() dto: CreateOrderPointDetailDto) {
    const result = await this.orderPointDetailsService.create(dto);
    return result;
  }

  @Patch('/:id')
  @ResponseMessage('Order point detail has been updated successfully.')
  async update(
    @Param('id') id: string,
    @Body() dto: CreateOrderPointDetailDto,
  ) {
    const updateData = { ...dto };

    if (!id) {
      throw new Error('Order point detail ID is required');
    }

    return this.orderPointDetailsService.update(
      new Types.ObjectId(id),
      updateData,
    );
  }

  @Delete('/:id')
  @ResponseMessage('Order point detail has been deleted successfully.')
  async delete(@Param('id') id: string) {
    return this.orderPointDetailsService.delete(new Types.ObjectId(id));
  }
}
