import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentMethodEntity,
  PaymentMethodSchema,
} from './schema/payment-method.schema';
import { PaymentMethodsController } from './controller/payment-methods.controller';
import { PaymentMethodsService } from './service/payment-methods.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethodEntity.name, schema: PaymentMethodSchema },
    ]),
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
