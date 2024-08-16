import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';

import { CreateProductDto } from '../dto/create-product.dto';

import { ProductInterface } from '../interface/product.interface';
import { ProductEntity } from '../schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductEntity.name)
    private productModel: PaginateModel<ProductInterface>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductInterface> {
    const newProduct = new this.productModel(dto);
    return newProduct.save();
  }

  async get(): Promise<PaginateResult<ProductInterface>> {
    const options = {
      limit: 10,
      sort: {
        createdAt: -1,
      },
    };

    return this.productModel.paginate({}, options);
  }

  async getById(productId: Types.ObjectId): Promise<ProductInterface> {
    return this.productModel.findById(productId).exec();
  }

  async update(
    productId: Types.ObjectId,
    dto: CreateProductDto,
  ): Promise<ProductInterface> {
    const product = await this.productModel.findById(productId).lean();

    if (!product) {
      throw new Error('Product not found');
    }

    return await this.productModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: dto,
      },
      { new: true },
    );
  }

  async delete(productId: Types.ObjectId): Promise<ProductInterface> {
    return await this.productModel.findOneAndUpdate(
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
