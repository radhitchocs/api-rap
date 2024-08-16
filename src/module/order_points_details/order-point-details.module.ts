import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderPointDetailEntity,
  OrderPointDetailSchema,
} from './schema/order-point-detail.schema';
import { OrderPointDetailsController } from './controller/order-point-details.controller';
import { OrderPointDetailsService } from './service/order-point-details.service';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderPointDetailEntity.name, schema: OrderPointDetailSchema },
    ]),
    OrdersModule,
    forwardRef(() => ProductsModule),
  ],
  controllers: [OrderPointDetailsController],
  providers: [OrderPointDetailsService],
  exports: [OrderPointDetailsService],
})
export class OrderPointDetailsModule {}
