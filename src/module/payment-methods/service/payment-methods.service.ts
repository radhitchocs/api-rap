import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethodEntity } from '../schema/payment-method.schema';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { GetPaymentMethodDto } from '../dto/get-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethodEntity.name)
    private paymentMethodModel: Model<PaymentMethodEntity>,
  ) {}

  async create(dto: CreatePaymentMethodDto): Promise<PaymentMethodEntity> {
    const newPaymentMethod = new this.paymentMethodModel(dto);
    return newPaymentMethod.save();
  }

  async get(dto: GetPaymentMethodDto) {
    const { search } = dto;
    const query = search ? { name: new RegExp(search, 'i') } : {};
    return this.paymentMethodModel.find(query).exec();
  }

  async getById(id: string): Promise<PaymentMethodEntity> {
    return this.paymentMethodModel.findById(id).exec();
  }
}
