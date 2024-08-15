import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderDetailEntity,
  OrderDetailSchema,
} from './schema/order-detail.schema';
import { OrderDetailsController } from './controller/order_details.controller';
import { OrderDetailsService } from './service/order-details.service';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDetailEntity.name, schema: OrderDetailSchema },
    ]),
    forwardRef(() => OrdersModule),
    ProductsModule,
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
  exports: [OrderDetailsService],
})
export class OrderDetailsModule {}
