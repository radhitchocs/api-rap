import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateResult, Types } from 'mongoose';
import { PaymentMethodEntity } from '../schema/payment-method.schema';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { PaginateModel } from 'mongoose';
import { PaymentMethodInterface } from '../interface/payment-methods.interface';
@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethodEntity.name)
    private paymentMethodModel: PaginateModel<PaymentMethodEntity>,
  ) {}

  async get(): Promise<PaginateResult<PaymentMethodInterface>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };
    return this.paymentMethodModel.paginate({}, options);
  }

  async create(dto: CreatePaymentMethodDto): Promise<PaymentMethodEntity> {
    const newPaymentMethod = new this.paymentMethodModel(dto);
    return newPaymentMethod.save();
  }

  async getById(id: string): Promise<PaymentMethodEntity> {
    return this.paymentMethodModel.findById(id).exec();
  }

  async update(
    id: Types.ObjectId,
    dto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const paymentMethod = await this.paymentMethodModel.findById(id).lean();

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    return await this.paymentMethodModel.findOneAndUpdate(
      { _id: id },
      {
        $set: dto,
      },
      { new: true },
    );
  }

  async delete(id: Types.ObjectId) {
    return await this.paymentMethodModel.findOneAndUpdate(
      { _id: id },
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
