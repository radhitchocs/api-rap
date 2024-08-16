import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { PaymentMethodsService } from '../service/payment-methods.service';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { Types } from 'mongoose';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  @ResponseMessage('Successfully retrieved payment methods!')
  async get() {
    const result = await this.paymentMethodsService.get();
    return result;
  }

  @Get('/:id')
  @ResponseMessage('Successfully retrieved payment method!')
  async getById(@Param('id') id: string) {
    const result = await this.paymentMethodsService.getById(id);
    return result;
  }

  @Post()
  @ResponseMessage('Payment method has been created successfully.')
  async create(@Body() dto: CreatePaymentMethodDto) {
    const result = await this.paymentMethodsService.create(dto);
    return result;
  }

  @Patch('/:id')
  @ResponseMessage('Payment method has been updated successfully.')
  async update(@Param('id') id: string, @Body() dto: CreatePaymentMethodDto) {
    const updateData = { ...dto };

    return this.paymentMethodsService.update(
      new Types.ObjectId(id),
      updateData,
    );
  }

  @Delete('/:id')
  @ResponseMessage('Payment method has been deleted successfully.')
  async delete(@Param('id') id: string) {
    return this.paymentMethodsService.delete(new Types.ObjectId(id));
  }
}
