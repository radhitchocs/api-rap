// src/module/orders/schema/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'orders',
  timestamps: true,
})
export class OrderEntity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customer_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PaymentMethod' })
  payment_method_id: Types.ObjectId;

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
  product_id: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(OrderEntity);
OrderSchema.plugin(mongoosePaginate);
