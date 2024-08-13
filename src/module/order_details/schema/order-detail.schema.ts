import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'order_details',
  timestamps: true,
})
export class OrderDetailEntity extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  amount: number;
}

export const OrderDetailSchema =
  SchemaFactory.createForClass(OrderDetailEntity);
