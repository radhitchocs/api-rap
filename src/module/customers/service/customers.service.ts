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
    console.log('Creating customer with data:', dto);
    const newCustomer = new this.customerModel(dto);
    console.log('New customer model:', newCustomer);
    return await newCustomer.save();
  }

  async update(
    customerId: Types.ObjectId,
    dto: Partial<CreateCustomerDto>,
  ): Promise<CustomerInterface> {
    const customer = await this.customerModel.findById(customerId);

    if (!customer) {
      throw new Error('Customer not found');
    }

    Object.assign(customer, dto);
    return customer.save();
  }

  async delete(customerId: Types.ObjectId) {
    return await this.customerModel.findOneAndUpdate(
      { _id: customerId },
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
          is_active: false,
        },
      },
      { new: true },
    );
  }
}
