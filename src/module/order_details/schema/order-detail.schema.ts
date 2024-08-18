import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'order_details',
  timestamps: true,
})
export class OrderDetailEntity extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Order' })
  order_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  product: Types.ObjectId;

  @Prop({ required: true })
  qty: number;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  disc: number;

  @Prop({ required: true })
  amount: number;
}

export const OrderDetailSchema =
  SchemaFactory.createForClass(OrderDetailEntity);
OrderDetailSchema.plugin(mongoosePaginate);
