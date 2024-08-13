import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';

import { ResponseMessage } from 'src/decorator/response.decorator';
import { IsPublic } from 'src/metadata/metadata/is-public.metadata';

import { CreateCustomerDto } from '../dto/create-customer.dto';
import { GetCustomerDto } from '../dto/get-customer.dto';
import { CustomersService } from '../service/customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Post()
  @ResponseMessage('Customer has been created successfully.')
  async create(@Body() dto: CreateCustomerDto) {
    const result = await this.customerService.create(dto);
    return result;
  }

  @Get()
  @ResponseMessage('Successfully retrieved customers!')
  async get(@Query() dto: GetCustomerDto) {
    const result = await this.customerService.get(dto);
    return result;
  }

  @IsPublic()
  @Get('/:customerId/loyalty-points')
  @ResponseMessage('Successfully retrieved loyalty points!')
  async getLoyaltyPoints(@Param('customerId') customerId: string) {
    const result = await this.customerService.getLoyaltyPoints(customerId);
    return result;
  }
}
