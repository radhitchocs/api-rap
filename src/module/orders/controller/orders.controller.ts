// src/module/orders/controller/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { CreateOrderDto } from '../dto/create-order.dto';
import { OrdersService } from '../service/orders.service';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { storage, validateFileExtension } from 'src/config/storage.config';
import { OrderEntity } from '../schema/order.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('proof_payment', {
      storage,
      fileFilter: (req, file, callback) => {
        validateFileExtension(req, file, callback)(['.jpg', '.png', '.jpeg']);
      },
    }),
  )
  @ResponseMessage('Create order successfully')
  async create(
    @Body() dto: CreateOrderDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<OrderEntity> {
    const result = await this.ordersService.create({
      ...dto,
      proof_payment: file.filename,
    });
    return result;
  }

  @Get()
  @ResponseMessage('Get orders successfully')
  async get() {
    const result = await this.ordersService.get();
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
  @UseInterceptors(
    FileInterceptor('proof_payment', {
      storage,
      fileFilter: (req, file, callback) => {
        validateFileExtension(req, file, callback)(['.jpg', '.png', '.jpeg']);
      },
    }),
  )
  @ResponseMessage('Update order successfully')
  async update(
    @Param('orderId') orderId: string,
    @Body() dto: CreateOrderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updateData = {
      ...dto,
      proof_payment: file ? file.filename : undefined,
    };

    return this.ordersService.update(new Types.ObjectId(orderId), updateData);
  }

  @Delete('/:orderId')
  @ResponseMessage('Delete order successfully')
  async delete(@Param('orderId') orderId: string) {
    return this.ordersService.delete(new Types.ObjectId(orderId));
  }
}
