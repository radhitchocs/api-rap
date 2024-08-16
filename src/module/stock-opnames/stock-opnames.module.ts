import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StockOpnamesController } from './controller/stock-opnames.controller';
import {
  StockOpnameEntity,
  StockOpnameSchema,
} from './schema/stock-opname.schema';
import { StockOpnamesService } from './service/stock-opnames.service';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockOpnameEntity.name, schema: StockOpnameSchema },
    ]),
    ProductsModule,
    UsersModule,
  ],
  controllers: [StockOpnamesController],
  providers: [StockOpnamesService],
  exports: [StockOpnamesService],
})
export class StockOpnamesModule {}
