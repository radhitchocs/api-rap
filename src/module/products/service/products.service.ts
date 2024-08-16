import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductInterface } from '../interface/product.interface';
import { ProductEntity } from '../schema/product.schema';
import { UserService } from 'src/module/users/service/users.service'; // Import the UsersService

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductEntity.name)
    private productModel: PaginateModel<ProductInterface>,
    private readonly usersService: UserService, // Inject the UsersService
  ) {}

  async create(dto: CreateProductDto): Promise<ProductInterface> {
    if (dto.user_id) {
      const user = await this.usersService.findById(dto.user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

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
    if (dto.user_id) {
      const user = await this.usersService.findById(dto.user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

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
          is_active: false,
        },
      },
      { new: true },
    );
  }
}
