import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerInterface } from '../interface/customer.interface';
import { CustomerEntity } from '../schema/customer.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(CustomerEntity.name)
    private customerModel: PaginateModel<CustomerEntity>,
  ) {}

  async get(dto: any): Promise<PaginateResult<CustomerEntity>> {
    const { page, limit } = dto;
    const options = {
      page,
      limit: limit || 10,
      sort: {
        createdAt: -1,
      },
    };

    return this.customerModel.paginate({}, options);
  }

  async create(dto: CreateCustomerDto): Promise<CustomerInterface> {
    const newCustomer = new this.customerModel(dto);
    return newCustomer.save();
  }

  async getLoyaltyPoints(customerId: string): Promise<number> {
    const customer = await this.customerModel.findById(customerId).exec();
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer.loyalty_points;
  }
}
