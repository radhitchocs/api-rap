// src/module/orders/schema/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CustomerEntity } from 'src/module/customers/schema/customer.schema';
import { User } from 'src/module/users/schema/user.schema';
import { PaymentMethodEntity } from 'src/module/payment-methods/schema/payment-method.schema';
import { ProductEntity } from 'src/module/products/schema/product.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { SoftDelete } from 'src/common/mongoose-delete/soft-delete';

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class OrderEntity extends Document {
  @Prop({ type: Types.ObjectId, ref: CustomerEntity.name })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PaymentMethodEntity.name })
  payment_method: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ProductEntity.name })
  product: Types.ObjectId;

  @Prop()
  proof_payment: string;

  @Prop()
  total: number;

  @Prop()
  pay: number;

  @Prop()
  change: number;

  @Prop()
  note: string;

  @Prop()
  qty: number;

  @Prop()
  buy_price: number;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderEntity);
OrderSchema.plugin(mongoosePaginate);
OrderSchema.plugin(SoftDelete, { overrideMethods: true, deletedAt: true });
