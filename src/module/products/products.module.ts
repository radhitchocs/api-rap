import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './controller/products.controller';
import { ProductEntity, ProductSchema } from './schema/product.schema';
import { ProductsService } from './service/products.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductEntity.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
