/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  UploadedFile,
  UseInterceptors,
  Patch,
  Delete,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ResponseMessage } from 'src/decorator/response.decorator';

import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../service/products.service';
import { ProductInterface } from '../interface/product.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateFileExtension, storage } from 'src/config/storage.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ResponseMessage('Successfully fetched products!')
  async get() {
    const result = await this.productsService.get();
    return result;
  }

  @Get('/:productId')
  @ResponseMessage('Successfully fetched product details!')
  async getById(@Param('productId') productId: string) {
    const result = await this.productsService.getById(
      new Types.ObjectId(productId),
    );
    return result;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter: (req, file, callback) => {
        validateFileExtension(req, file, callback)(['.jpg', '.png', '.jpeg']);
      },
    }),
  )
  @ResponseMessage('Product has been created successfully.')
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductInterface> {
    const result = await this.productsService.create({
      ...dto,
      image: file.filename,
    });
    return result;
  }

  @Patch('/:productId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter: (req, file, callback) => {
        validateFileExtension(req, file, callback)(['.jpg', '.png', '.jpeg']);
      },
    }),
  )
  @ResponseMessage('Successfully updated product details!')
  async update(
    @Param('productId') productId: string,
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductInterface> {
    const updateData = { ...dto };

    if (file) {
      updateData.image = file.filename;
    }

    return this.productsService.update(
      new Types.ObjectId(productId),
      updateData,
    );
  }

  @Delete('/:productId')
  @ResponseMessage('Successfully deleted product!')
  async delete(@Param('productId') productId: string) {
    return this.productsService.delete(new Types.ObjectId(productId));
  }
}
