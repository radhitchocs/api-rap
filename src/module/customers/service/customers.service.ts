import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerInterface } from '../interface/customer.interface';
import { CustomerEntity } from '../schema/customer.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(CustomerEntity.name)
    private customerModel: PaginateModel<CustomerEntity>,
  ) {}

  async get(): Promise<PaginateResult<CustomerEntity>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };

    return this.customerModel.paginate({}, options);
  }

  async getById(customerId: Types.ObjectId): Promise<CustomerInterface> {
    return this.customerModel.findById(customerId).exec();
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

  async update(
    customerId: Types.ObjectId,
    dto: CreateCustomerDto,
  ): Promise<CustomerInterface> {
    const customer = await this.customerModel.findById(customerId).lean();

    if (!customer) {
      throw new Error('Customer not found');
    }
    return await this.customerModel.findOneAndUpdate(
      { _id: customerId },
      {
        $set: dto,
      },
      { new: true },
    );
  }

  async delete(productId: Types.ObjectId) {
    return await this.customerModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );
  }
}
