// src/module/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersController } from './controller/orders.controller';
import { OrdersService } from './service/orders.service';
import { OrderEntity, OrderSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderEntity.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
