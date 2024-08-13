import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderDetailEntity,
  OrderDetailSchema,
} from './schema/order-detail.schema';
import { OrderDetailsController } from './controller/order_details.controller';
import { OrderDetailsService } from './service/order-details.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDetailEntity.name, schema: OrderDetailSchema },
    ]),
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
  exports: [OrderDetailsService],
})
export class OrderDetailsModule {}
