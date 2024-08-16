import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomersController } from './controller/customers.controller';
import { CustomerEntity, CustomerSchema } from './schema/customer.schema';
import { CustomersService } from './service/customers.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerEntity.name, schema: CustomerSchema },
    ]),
    ConfigModule,
    UsersModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
