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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { IsPublic } from 'src/metadata/metadata/is-public.metadata';

import { CreateProductDto } from '../dto/create-product.dto';
import { GetProductDto } from '../dto/get-product.dto';
import { ProductsService } from '../service/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ResponseMessage('Product has been created successfully.')
  async create(@Body() dto: CreateProductDto) {
    const result = await this.productsService.create(dto);
    return result;
  }

  @Get()
  @ResponseMessage('Successfully fetched products!')
  async get(@Query() dto: GetProductDto) {
    const result = await this.productsService.get(dto);
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
}
