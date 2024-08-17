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
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomersService } from '../service/customers.service';
import { Types } from 'mongoose';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get()
  @ResponseMessage('Successfully retrieved customers!')
  async get() {
    const result = await this.customerService.get();
    return result;
  }

  @Get('/:customerId')
  @ResponseMessage('Successfully retrieved details of customer!')
  async getById(@Param('customerId') customerId: string) {
    const result = await this.customerService.getById(
      new Types.ObjectId(customerId),
    );
    return result;
  }

  @Post()
  @ResponseMessage('Customer has been created successfully.')
  async create(@Body() dto: CreateCustomerDto) {
    const result = await this.customerService.create(dto);
    return result;
  }

  @Patch('/:customerId')
  @ResponseMessage('Customer has been updated successfully.')
  async update(
    @Param('customerId') customerId: string,
    @Body() dto: Partial<CreateCustomerDto>,
  ) {
    return this.customerService.update(new Types.ObjectId(customerId), dto);
  }

  @Delete('/:customerId')
  @ResponseMessage('Customer has been deactivated successfully.')
  async delete(@Param('customerId') customerId: string) {
    return this.customerService.delete(new Types.ObjectId(customerId));
  }
}
