import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderPointDetailEntity,
  OrderPointDetailSchema,
} from './schema/order-point-detail.schema';
import { OrderPointDetailsController } from './controller/order-point-details.controller';
import { OrderPointDetailsService } from './service/order-point-details.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderPointDetailEntity.name, schema: OrderPointDetailSchema },
    ]),
  ],
  controllers: [OrderPointDetailsController],
  providers: [OrderPointDetailsService],
  exports: [OrderPointDetailsService],
})
export class OrderPointDetailsModule {}
