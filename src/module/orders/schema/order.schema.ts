// src/module/orders/schema/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
  total: number;

  @Prop()
  payment_status: string;

  @Prop({
    type: [
      {
        product_id: Types.ObjectId,
        quantity: Number,
        price: Number,
        discount: Number,
        amount: Number,
      },
    ],
  })
  order_details: {
    product_id: Types.ObjectId;
    quantity: number;
    price: number;
    discount?: number;
    amount: number;
  }[];

  @Prop({ default: Date.now })
  created_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderEntity);
