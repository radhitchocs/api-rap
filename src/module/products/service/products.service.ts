import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateProductDto } from '../dto/create-product.dto';
import { GetProductDto } from '../dto/get-product.dto';
import { ProductInterface } from '../interface/product.interface';
import { ProductEntity } from '../schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductEntity.name)
    private productModel: Model<ProductInterface>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductInterface> {
    const newProduct = new this.productModel(dto);
    return newProduct.save();
  }

  async get(dto: GetProductDto): Promise<ProductInterface[]> {
    return this.productModel.find(dto).exec();
  }

  async getById(productId: Types.ObjectId): Promise<ProductInterface> {
    return this.productModel.findById(productId).exec();
  }
}
