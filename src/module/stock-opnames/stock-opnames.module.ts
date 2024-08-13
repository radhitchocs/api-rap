import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StockOpnamesController } from './controller/stock-opnames.controller';
import {
  StockOpnameEntity,
  StockOpnameSchema,
} from './schema/stock-opname.schema';
import { StockOpnamesService } from './service/stock-opnames.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockOpnameEntity.name, schema: StockOpnameSchema },
    ]),
  ],
  controllers: [StockOpnamesController],
  providers: [StockOpnamesService],
  exports: [StockOpnamesService],
})
export class StockOpnamesModule {}
