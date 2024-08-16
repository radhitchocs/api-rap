// src/module/orders/orders.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersController } from './controller/orders.controller';
import { OrdersService } from './service/orders.service';
import { OrderEntity, OrderSchema } from './schema/order.schema';
import { CustomersModule } from '../customers/customers.module';
import { UsersModule } from '../users/users.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { OrderDetailsModule } from '../order_details/order-details.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderEntity.name, schema: OrderSchema },
    ]),
    CustomersModule,
    UsersModule,
    PaymentMethodsModule,
    forwardRef(() => OrderDetailsModule),
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
