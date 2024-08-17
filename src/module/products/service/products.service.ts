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

    if (!dto.batch_code) {
      throw new Error('Batch code is required');
    }

    // Cek apakah sudah ada produk dengan batch_code yang sama
    const existingProduct = await this.productModel
      .findOne({ batch_code: dto.batch_code })
      .exec();

    if (existingProduct) {
      // Update produk yang ada dengan data baru
      return await this.productModel.findOneAndUpdate(
        { batch_code: dto.batch_code },
        {
          $set: {
            name: dto.name, // Update nama jika perlu
            description: dto.description, // Update deskripsi jika perlu
            image: dto.image || existingProduct.image, // Gunakan gambar baru jika ada
            stock: existingProduct.stock + dto.stock, // Tambah stok
            buy_price: dto.buy_price, // Update harga beli jika perlu
            sell_price: dto.sell_price, // Update harga jual jika perlu
            discount: dto.discount || existingProduct.discount, // Gunakan diskon baru jika ada
            is_promo:
              dto.is_promo !== undefined
                ? dto.is_promo
                : existingProduct.is_promo, // Update promo jika perlu
            is_active:
              dto.is_active !== undefined
                ? dto.is_active
                : existingProduct.is_active, // Update status aktif jika perlu
          },
        },
        { new: true }, // Kembalikan produk yang telah diperbarui
      );
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

  async updateStock(
    productId: Types.ObjectId,
    newStock: number,
  ): Promise<ProductEntity> {
    if (isNaN(newStock) || newStock < 0) {
      throw new Error('Invalid stock value');
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      { $set: { stock: newStock } },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }

    return updatedProduct as ProductEntity;
  }

  async findByBatchCode(batchCode: string): Promise<ProductInterface | null> {
    return this.productModel.findOne({ batch_code: batchCode }).exec();
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
