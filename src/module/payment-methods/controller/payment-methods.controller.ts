import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { PaymentMethodsService } from '../service/payment-methods.service';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { GetPaymentMethodDto } from '../dto/get-payment-method.dto';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  @ResponseMessage('Payment method has been created successfully.')
  async create(@Body() dto: CreatePaymentMethodDto) {
    const result = await this.paymentMethodsService.create(dto);
    return result;
  }

  @Get()
  @ResponseMessage('Successfully retrieved payment methods!')
  async get(@Query() dto: GetPaymentMethodDto) {
    const result = await this.paymentMethodsService.get(dto);
    return result;
  }

  @Get('/:id')
  @ResponseMessage('Successfully retrieved payment method!')
  async getById(@Param('id') id: string) {
    const result = await this.paymentMethodsService.getById(id);
    return result;
  }
}
