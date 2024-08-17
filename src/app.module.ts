import * as fs from 'fs';
import * as path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseDatabaseConfig } from 'src/config/database/mongoose.database.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { RolesModule } from './module/roles/roles.module';
import { CustomersModule } from './module/customers/customers.module';
import { OrderDetailsModule } from './module/order_details/order-details.module';
import { OrdersModule } from './module/orders/orders.module';
import { PaymentMethodsModule } from './module/payment-methods/payment-methods.module';
import { PermissionsModule } from './module/permissions/permissions.module';
import { RestModule } from './module/rest/rest.module';
import { ProductsModule } from './module/products/products.module';
import { StockOpnamesModule } from './module/stock-opnames/stock-opnames.module';
import { PrinterSettingsModule } from './module/printer-settings/printer-settigs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseDatabaseConfig,
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => {
        const uploadsPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsPath)) {
          fs.mkdirSync(uploadsPath);
        }

        return [
          {
            rootPath: uploadsPath,
            serveRoot: '/uploads/',
          },
        ];
      },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CustomersModule,
    OrderDetailsModule,
    OrdersModule,
    PaymentMethodsModule,
    PermissionsModule,
    RestModule,
    ProductsModule,
    StockOpnamesModule,
    PrinterSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
