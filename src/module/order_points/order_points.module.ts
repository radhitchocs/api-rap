import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderPointsController } from './controller/order_points.controller';
import {
  OrderPointEntity,
  OrderPointSchema,
} from './schema/order_point.schema';
import { OrderPointsService } from './service/order_points.service';
import { OrderPointDetailsModule } from '../order_points_details/order-point-details.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderPointEntity.name, schema: OrderPointSchema },
    ]),
    OrderPointDetailsModule,
    forwardRef(() => OrdersModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => CustomersModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [OrderPointsController],
  providers: [OrderPointsService],
  exports: [OrderPointsService],
})
export class OrderPointsModule {}
