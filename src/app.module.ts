import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { RolesModule } from './module/roles/roles.module';
import { CustomersModule } from './module/customers/customers.module';
import { OrderDetailsModule } from './module/order_details/order-details.module';
import { OrderPointsModule } from './module/order_points/order_points.module';
import { OrdersModule } from './module/orders/orders.module';
import { PaymentMethodsModule } from './module/payment-methods/payment-methods.module';
import { PermissionsModule } from './module/permissions/permissions.module';
import { PointSettingsModule } from './module/point-settings/point-settings.module';
import { RestModule } from './module/rest/rest.module';
import { ProductsModule } from './module/products/products.module';
import { StockOpnamesModule } from './module/stock-opnames/stock-opnames.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/api-rap'),
    AuthModule,
    CustomersModule,
    OrderDetailsModule,
    OrderPointsModule,
    OrdersModule,
    PaymentMethodsModule,
    PermissionsModule,
    PointSettingsModule,
    ProductsModule,
    RestModule,
    RolesModule,
    StockOpnamesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
