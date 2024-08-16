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
import { CreateOrderPointDto } from '../dto/create-order_point.dto';
import { OrderPointsService } from '../service/order_points.service';

@Controller('order-points')
export class OrderPointsController {
  constructor(private readonly orderPointsService: OrderPointsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved order points!')
  async get() {
    const result = await this.orderPointsService.get();
    return result;
  }

  @Get('/:id')
  @ResponseMessage('Successfully retrieved order point details!')
  async getById(@Param('id') id: string) {
    const result = await this.orderPointsService.getById(id); // Pass ID as string
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
    if (!id) {
      throw new Error('Order point ID is required');
    }

    return this.orderPointsService.update(id, dto); // Pass ID as string
  }

  @Delete('/:id')
  @ResponseMessage('Order point has been deleted successfully.')
  async delete(@Param('id') id: string) {
    return this.orderPointsService.delete(id); // Pass ID as string
  }
}
