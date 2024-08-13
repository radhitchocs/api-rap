import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderPointsController } from './controller/order_points.controller';
import {
  OrderPointEntity,
  OrderPointSchema,
} from './schema/order_point.schema';
import { OrderPointsService } from './service/order_points.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderPointEntity.name, schema: OrderPointSchema },
    ]),
  ],
  controllers: [OrderPointsController],
  providers: [OrderPointsService],
  exports: [OrderPointsService],
})
export class OrderPointsModule {}
